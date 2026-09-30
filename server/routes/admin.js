const express = require('express');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/sellers
// Get all sellers for the admin dashboard
router.get('/sellers', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(sellers);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch sellers',
      error: err.message,
    });
  }
});

// PUT /api/admin/sellers/:id/approval
// Approve or unapprove a seller
router.put(
  '/sellers/:id/approval',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { approved } = req.body;

      if (typeof approved !== 'boolean') {
        return res.status(400).json({
          message: 'approved must be a boolean',
        });
      }

      const seller = await User.findOne({
        _id: req.params.id,
        role: 'seller',
      });

      if (!seller) {
        return res.status(404).json({
          message: 'Seller not found',
        });
      }

      seller.approved = approved;
      await seller.save();

      res.json({
        message: approved
          ? 'Seller approved successfully'
          : 'Seller approval removed successfully',
        seller: {
          id: seller._id,
          name: seller.name,
          email: seller.email,
          role: seller.role,
          address: seller.address,
          approved: seller.approved,
        },
      });
    } catch (err) {
      res.status(500).json({
        message: 'Failed to update seller approval',
        error: err.message,
      });
    }
  }
);

module.exports = router;