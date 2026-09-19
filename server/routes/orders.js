const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const STATUS_FLOW = ['placed', 'packed', 'shipped', 'delivered'];

// POST /api/orders
// Buyer places an order after payment succeeds on the frontend
router.post('/', requireAuth, requireRole('buyer'), async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { items, totalAmount, paymentId } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        message: 'Order must have at least one item',
      });
    }

    // Start MongoDB transaction
    session.startTransaction();

    const enrichedItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity);

      // Validate quantity
      if (!Number.isInteger(quantity) || quantity <= 0) {
        await session.abortTransaction();
        return res.status(400).json({
          message: 'Product quantity must be a positive integer',
        });
      }

      // Find product
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({
          message: `Product ${item.productId} not found`,
        });
      }

      // Check stock
      if (product.stock < quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available stock: ${product.stock}`,
        });
      }

      // Atomically decrease stock only if enough stock still exists
      const stockUpdate = await Product.updateOne(
        {
          _id: product._id,
          stock: { $gte: quantity },
        },
        {
          $inc: { stock: -quantity },
        },
        { session }
      );

      if (stockUpdate.modifiedCount !== 1) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Snapshot product details at time of purchase
      enrichedItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    // Create order inside the same transaction
    const order = new Order({
      buyerId: req.user.id,
      items: enrichedItems,
      totalAmount,
      paymentId,
    });

    await order.save({ session });

    // Commit stock changes + order creation together
    await session.commitTransaction();

    res.status(201).json(order);
  } catch (err) {
    // Undo any stock changes if something fails
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error('Failed to place order:', err);

    res.status(500).json({
      message: 'Failed to place order',
      error: err.message,
    });
  } finally {
    session.endSession();
  }
});

router.get('/mine', requireAuth, requireRole('buyer'), async (req, res) => {
  const orders = await Order.find({
    buyerId: req.user.id,
  }).sort({ createdAt: -1 });

  res.json(orders);
});

// Orders that contain at least one item belonging to this seller
router.get('/seller', requireAuth, requireRole('seller'), async (req, res) => {
  const orders = await Order.find({
    'items.sellerId': req.user.id,
  }).sort({ createdAt: -1 });

  res.json(orders);
});

router.put('/:id/status', requireAuth, requireRole('seller'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!STATUS_FLOW.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    const ownsAnItem = order.items.some(
      (i) => i.sellerId.toString() === req.user.id
    );

    if (!ownsAnItem) {
      return res.status(403).json({
        message: 'You do not have items in this order',
      });
    }

    order.status = status;

    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to update status',
      error: err.message,
    });
  }
});

module.exports = router;