
const mongoose = require('mongoose');

const orderedProductSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true }, // Links to the parent Invoice (e.g., INV-1001)
  customerName: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true }, // Price at the time of sale
  quantity: { type: Number, required: true },
  total: { type: Number, required: true }, // price * quantity
  image: { type: String },
  date: { type: Date, default: Date.now }
});

// Helper to remove _id when converting to JSON if needed
orderedProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('OrderedProduct', orderedProductSchema);
