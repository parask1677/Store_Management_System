
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const OrderedProduct = require('../models/OrderedProduct');

const INITIAL_INVOICES = [
  { 
    displayId: 'INV-1001', 
    customerName: 'Dev', 
    date: new Date(Date.now() - 86400000 * 2), 
    items: [
      { name: 'Wireless Headphones', category: 'Electronics', price: 2499, quantity: 2, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
      { name: 'Ergonomic Mouse', category: 'Electronics', price: 1499, quantity: 1, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' }
    ], 
    subtotal: 6497, tax: 649.7, discount: 0, total: 7146.7, status: 'Completed'
  },
  { 
    displayId: 'INV-1002', 
    customerName: 'Nitin', 
    date: new Date(), 
    items: [
       { name: 'Mechanical Keyboard', category: 'Electronics', price: 4999, quantity: 1, image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500&q=80' },
       { name: 'Urban Backpack', category: 'Accessories', price: 3499, quantity: 1, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' }
    ], 
    subtotal: 8498, tax: 849.8, discount: 0, total: 9347.8, status: 'Pending'
  }
];

const getInvoices = async (req, res) => {
  try {
    const count = await Invoice.countDocuments();
    if (count === 0) {
      await Invoice.insertMany(INITIAL_INVOICES);
      console.log('✅ Seeded Invoices');
    }
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const { items, customerName, total, date } = req.body;
    
    // 1. Generate Custom ID for visual tracking
    const displayId = 'INV-' + Math.floor(1000 + Math.random() * 9000);

    // 2. Sanitize Items for Invoice Schema
    // We strictly map only the fields defined in the Invoice Item schema to avoid validation errors
    const sanitizedItems = items.map(item => ({
      id: item.id || 'unknown_id',
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image || '',
      category: item.category || 'General'
    }));

    // 3. Create Invoice
    const invoice = await Invoice.create({ 
      ...req.body, 
      displayId,
      items: sanitizedItems 
    });

    // 4. Save Ordered Products (Sales Line Items) to separate collection
    // This allows for granular analytics on products sold
    if (items && items.length > 0) {
      const orderedProductsData = items.map(item => ({
        invoiceId: displayId,
        customerName: customerName,
        productId: item.id || 'unknown',
        productName: item.name,
        category: item.category || 'General',
        price: Number(item.price),
        quantity: Number(item.quantity),
        total: Number(item.price) * Number(item.quantity),
        image: item.image || '',
        date: date ? new Date(date) : new Date()
      }));
      
      await OrderedProduct.insertMany(orderedProductsData);
    }

    // 5. Decrease Stock
    // We only update stock if we have a valid database ID (length check is a simple heuristic for MongoDB ObjectIds)
    if (items && items.length > 0) {
      for (const item of items) {
        if (item.id && item.id.length > 10) {
          try {
            await Product.findByIdAndUpdate(item.id, { $inc: { stock: -item.quantity } });
          } catch (stockErr) {
            console.error(`Failed to update stock for product ${item.id}:`, stockErr.message);
            // Continue processing other items even if one stock update fails
          }
        }
      }
    }

    // 6. Update Customer Total Spent
    await Customer.findOneAndUpdate(
      { name: customerName },
      { $inc: { totalSpent: total } }
    );
    
    res.status(201).json(invoice);
  } catch (err) {
    console.error("Create Invoice Error:", err);
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getInvoices, createInvoice };
