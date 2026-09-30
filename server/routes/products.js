const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');
const { storage } = require('../utils/cloudinary');

const router = express.Router();
const upload = multer({ storage });

const PAGE_SIZE = 12;

// Middleware:
// Seller must be approved before performing seller product actions.
async function requireApprovedSeller(req, res, next) {
  try {
    const seller = await User.findOne({
      _id: req.user.id,
      role: 'seller',
    });

    if (!seller) {
      return res.status(404).json({
        message: 'Seller account not found',
      });
    }

    if (seller.approved !== true) {
      return res.status(403).json({
        message: 'Seller account is not approved by an admin',
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to verify seller approval',
      error: err.message,
    });
  }
}

// GET /api/products?domain=farming&search=tomato&page=1
//
// Public route.
// Only products belonging to approved sellers are visible.
router.get('/', async (req, res) => {
  try {
    const { domain, search, page = 1 } = req.query;

    // Find only approved sellers
    const approvedSellers = await User.find({
      role: 'seller',
      approved: true,
    }).select('_id');

    const approvedSellerIds = approvedSellers.map(
      (user) => user._id
    );

    const filter = {
      sellerId: { $in: approvedSellerIds },
    };

    if (domain) {
      filter.domain = domain;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: 'i',
      };
    }

    const skip = (Number(page) - 1) * PAGE_SIZE;

    const [products, count] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(PAGE_SIZE)
        .sort({ createdAt: -1 }),

      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      totalPages: Math.ceil(count / PAGE_SIZE) || 1,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch products',
      error: err.message,
    });
  }
});

// IMPORTANT:
// This route must come before /:id so "mine" isn't treated as an ID.
//
// Sellers can still view their own products even if their account
// is currently pending/unapproved.
router.get(
  '/seller/mine',
  requireAuth,
  requireRole('seller'),
  async (req, res) => {
    try {
      const products = await Product.find({
        sellerId: req.user.id,
      }).sort({ createdAt: -1 });

      res.json(products);
    } catch (err) {
      res.status(500).json({
        message: 'Failed to fetch seller products',
        error: err.message,
      });
    }
  }
);

// GET /api/products/:id
//
// Public route.
// A product is only accessible if its seller is approved.
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'sellerId',
      'name approved role'
    );

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    // Do not allow public access to products
    // belonging to an unapproved seller.
    if (
      product.sellerId.role === 'seller' &&
      product.sellerId.approved !== true
    ) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch product',
      error: err.message,
    });
  }
});

// POST /api/products
//
// Only an approved seller can create a product.
router.post(
  '/',
  requireAuth,
  requireRole('seller'),
  requireApprovedSeller,
  upload.single('image'),
  async (req, res) => {
    try {
      const {
        name,
        price,
        stock,
        description,
        domain,
        category,
      } = req.body;

      if (!name || !price || !domain) {
        return res.status(400).json({
          message: 'name, price and domain are required',
        });
      }

      const product = await Product.create({
        sellerId: req.user.id,
        name,
        price,
        stock: stock || 0,
        description,
        domain,
        category,
        imageUrl: req.file ? req.file.path : '',
      });

      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({
        message: 'Failed to create product',
        error: err.message,
      });
    }
  }
);

// PUT /api/products/:id
//
// Only an approved seller who owns the product can edit it.
router.put(
  '/:id',
  requireAuth,
  requireRole('seller'),
  requireApprovedSeller,
  upload.single('image'),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }

      if (product.sellerId.toString() !== req.user.id) {
        return res.status(403).json({
          message: 'You do not own this product',
        });
      }

      const fields = [
        'name',
        'price',
        'stock',
        'description',
        'domain',
        'category',
      ];

      fields.forEach((field) => {
        if (req.body[field] !== undefined) {
          product[field] = req.body[field];
        }
      });

      if (req.file) {
        product.imageUrl = req.file.path;
      }

      await product.save();

      res.json(product);
    } catch (err) {
      res.status(500).json({
        message: 'Failed to update product',
        error: err.message,
      });
    }
  }
);

// DELETE /api/products/:id
//
// Only an approved seller who owns the product can delete it.
router.delete(
  '/:id',
  requireAuth,
  requireRole('seller'),
  requireApprovedSeller,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }

      if (product.sellerId.toString() !== req.user.id) {
        return res.status(403).json({
          message: 'You do not own this product',
        });
      }

      await product.deleteOne();

      res.json({
        message: 'Product deleted',
      });
    } catch (err) {
      res.status(500).json({
        message: 'Failed to delete product',
        error: err.message,
      });
    }
  }
);

module.exports = router;