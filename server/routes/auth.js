const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { sendVerificationEmail } = require('../utils/sendEmail');

const router = express.Router();

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
}

// Generate a 6-digit email verification OTP
function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

// Create and store a hashed OTP
async function createEmailOtp(user) {
  const otp = generateOtp();

  const otpHash = await bcrypt.hash(otp, 10);

  user.emailOtpHash = otpHash;
  user.emailOtpExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await user.save();

  return otp;
}

// ======================================================
// SIGNUP
// ======================================================

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    if (!['buyer', 'seller'].includes(role)) {
      return res.status(400).json({
        message: 'Role must be buyer or seller',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({
      email: normalizedEmail,
    });

    if (existing) {
      return res.status(409).json({
        message: 'Email already registered',
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      role,
      emailVerified: false,
    });

    try {
      const otp = await createEmailOtp(user);

      await sendVerificationEmail(user.email, otp);
    } catch (emailError) {
      // If email sending fails, remove the newly created account
      await User.findByIdAndDelete(user._id);

      console.error('Verification email error:', emailError);

      return res.status(500).json({
        message: 'Could not send verification email. Please try again.',
      });
    }

    // Do NOT create a login token yet.
    // User must verify the email first.
    res.status(201).json({
      message: 'Account created. Verification OTP sent to your email.',
      email: user.email,
    });
  } catch (err) {
    console.error('Signup error:', err);

    res.status(500).json({
      message: 'Signup failed',
      error: err.message,
    });
  }
});

// ======================================================
// LOGIN
// ======================================================

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: (email || '').trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Require email verification before login
    if (!user.emailVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in',
        emailVerified: false,
        email: user.email,
      });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        approved: user.approved,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error('Login error:', err);

    res.status(500).json({
      message: 'Login failed',
      error: err.message,
    });
  }
});

// ======================================================
// VERIFY EMAIL OTP
// ======================================================

router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required',
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: 'Account not found',
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        message: 'Email is already verified',
      });
    }

    if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
      return res.status(400).json({
        message:
          'No verification OTP found. Please request a new OTP.',
      });
    }

    if (user.emailOtpExpiresAt < new Date()) {
      return res.status(400).json({
        message: 'OTP has expired. Please request a new OTP.',
      });
    }

    const otpMatches = await bcrypt.compare(
      otp.trim(),
      user.emailOtpHash
    );

    if (!otpMatches) {
      return res.status(400).json({
        message: 'Invalid OTP',
      });
    }

    // Mark email as verified
    user.emailVerified = true;

    // Remove OTP after successful verification
    user.emailOtpHash = null;
    user.emailOtpExpiresAt = null;

    await user.save();

    const token = generateToken(user);

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        approved: user.approved,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error('Email verification error:', err);

    res.status(500).json({
      message: 'Email verification failed',
      error: err.message,
    });
  }
});

// ======================================================
// RESEND EMAIL OTP
// ======================================================

router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: 'Account not found',
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        message: 'Email is already verified',
      });
    }

    const otp = await createEmailOtp(user);

    await sendVerificationEmail(user.email, otp);

    res.json({
      message: 'A new verification OTP has been sent to your email.',
    });
  } catch (err) {
    console.error('Resend OTP error:', err);

    res.status(500).json({
      message: 'Could not resend OTP',
      error: err.message,
    });
  }
});

// ======================================================
// GET CURRENT USER
// ======================================================

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch user',
      error: err.message,
    });
  }
});

// ======================================================
// UPDATE PROFILE
// ======================================================

// PUT /api/auth/profile
// Update the currently logged-in user's name and address
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Name is required',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    user.name = name.trim();

    if (address !== undefined) {
      user.address = address.trim();
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        approved: user.approved,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to update profile',
      error: err.message,
    });
  }
});

// ======================================================
// CHANGE PASSWORD
// ======================================================

router.put('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Current password is incorrect',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      message: 'Password changed successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to change password',
      error: err.message,
    });
  }
});

// ======================================================
// FORGOT PASSWORD
// ======================================================

// Request a password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Don't reveal whether an email exists
    if (!user) {
      return res.json({
        message:
          'If an account exists with this email, a password reset link has been generated.',
      });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Store a hashed version in the database
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;

    // Token expires after 15 minutes
    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    // For development/testing only
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    console.log('Password reset link:', resetLink);

    res.json({
      message:
        'If an account exists with this email, a password reset link has been generated.',
      resetLink,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to process password reset request',
      error: err.message,
    });
  }
});

// ======================================================
// RESET PASSWORD
// ======================================================

// Reset password using token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: 'Token and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long',
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired password reset link',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({
      message: 'Password reset successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to reset password',
      error: err.message,
    });
  }
});

module.exports = router;