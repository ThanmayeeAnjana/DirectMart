const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');

    const email = 'admin@directmart.com';
    const password = 'Admin@12345';

    const existing = await User.findOne({ email });

    if (existing) {
      console.log('Admin account already exists.');
      console.log('Role:', existing.role);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: 'DirectMart Admin',
      email,
      password: hashedPassword,
      role: 'admin',
      approved: true,
    });

    console.log('Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Password:', password);

    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  }
}

createAdmin();