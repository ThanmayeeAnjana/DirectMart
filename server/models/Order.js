const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentId: { type: String, default: '' },
    status: {
      type: String,
      enum: ['placed', 'packed', 'shipped', 'delivered'],
      default: 'placed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
