const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const STATUS_FLOW = ['placed', 'packed', 'shipped', 'delivered'];

// POST /api/orders  (buyer places an order after payment succeeds on the frontend)
router.post('/', requireAuth, requireRole('buyer'), async (req, res) => {
  try {
    const { items, totalAmount, paymentId } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    // Look up each product to snapshot name/price/sellerId at time of purchase
    const enrichedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      enrichedItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      buyerId: req.user.id,
      items: enrichedItems,
      totalAmount,
      paymentId,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
});

router.get('/mine', requireAuth, requireRole('buyer'), async (req, res) => {
  const orders = await Order.find({ buyerId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

// Orders that contain at least one item belonging to this seller
router.get('/seller', requireAuth, requireRole('seller'), async (req, res) => {
  const orders = await Order.find({ 'items.sellerId': req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.put('/:id/status', requireAuth, requireRole('seller'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUS_FLOW.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const ownsAnItem = order.items.some((i) => i.sellerId.toString() === req.user.id);
    if (!ownsAnItem) {
      return res.status(403).json({ message: 'You do not have items in this order' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
});

module.exports = router;
