const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    domain: {
      type: String,
      enum: ['farming', 'fishing', 'pottery', 'dairy'],
      required: true,
    },
    category: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
