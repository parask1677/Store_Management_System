const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  // We use a string ID for the visual invoice number (INV-XXXX), handled by controller
  displayId: String, 
  customerName: String,
  date: { type: Date, default: Date.now },
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    category: String
  }],
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' }
});

invoiceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // Use the custom display ID as the main ID for frontend reference if available
    ret.id = ret.displayId || ret._id;
    delete ret._id;
    delete ret.displayId;
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);