const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const { requireAuth, requireRole } = require('../middleware/auth');
const { storage } = require('../utils/cloudinary');

const router = express.Router();
const upload = multer({ storage });

const PAGE_SIZE = 12;

// GET /api/products?domain=farming&search=tomato&page=1
router.get('/', async (req, res) => {
  try {
    const { domain, search, page = 1 } = req.query;
    const filter = {};
    if (domain) filter.domain = domain;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * PAGE_SIZE;
    const [products, count] = await Promise.all([
      Product.find(filter).skip(skip).limit(PAGE_SIZE).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    res.json({ products, totalPages: Math.ceil(count / PAGE_SIZE) || 1 });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

// IMPORTANT: this specific route must come before /:id so "mine" isn't treated as an id
router.get('/seller/mine', requireAuth, requireRole('seller'), async (req, res) => {
  const products = await Product.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
  res.json(products);
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
});

router.post('/', requireAuth, requireRole('seller'), upload.single('image'), async (req, res) => {
  try {
    const { name, price, stock, description, domain, category } = req.body;
    if (!name || !price || !domain) {
      return res.status(400).json({ message: 'name, price and domain are required' });
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
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
});

router.put('/:id', requireAuth, requireRole('seller'), upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this product' });
    }

    const fields = ['name', 'price', 'stock', 'description', 'domain', 'category'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });
    if (req.file) product.imageUrl = req.file.path;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
});

router.delete('/:id', requireAuth, requireRole('seller'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this product' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});

module.exports = router;
