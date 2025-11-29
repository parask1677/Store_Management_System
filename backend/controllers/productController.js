const Product = require('../models/Product');

const INITIAL_PRODUCTS = [
  { name: 'Wireless Headphones', category: 'Electronics', price: 2499, stock: 45, supplier: 'TechAudio Inc.', minStockThreshold: 10, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { name: 'Mechanical Keyboard', category: 'Electronics', price: 4999, stock: 12, supplier: 'KeyMaster', minStockThreshold: 15, image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500&q=80' },
  { name: 'Ergonomic Mouse', category: 'Electronics', price: 1499, stock: 8, supplier: 'TechAudio Inc.', minStockThreshold: 10, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' },
  { name: 'Office Chair', category: 'Furniture', price: 12999, stock: 5, supplier: 'FurniCo', minStockThreshold: 3, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80' },
  { name: 'USB-C Hub', category: 'Accessories', price: 2999, stock: 100, supplier: 'ConnectWorld', minStockThreshold: 20, image: 'https://images.unsplash.com/photo-1625769923337-6a20815f4956?w=500&q=80' },
  { name: '27" 4K Monitor', category: 'Electronics', price: 28500, stock: 2, supplier: 'ViewMax', minStockThreshold: 5, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80' },
  { name: 'Smart Watch Gen 5', category: 'Wearables', price: 15999, stock: 25, supplier: 'TimeTech', minStockThreshold: 8, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
  { name: 'Urban Backpack', category: 'Accessories', price: 3499, stock: 30, supplier: 'CarryOn', minStockThreshold: 10, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
  { name: 'Gaming Controller', category: 'Gaming', price: 4500, stock: 18, supplier: 'GameZone', minStockThreshold: 5, image: 'https://images.unsplash.com/photo-1600080972464-8cb882741a99?w=500&q=80' },
  { name: 'Modern Desk Lamp', category: 'Furniture', price: 1800, stock: 40, supplier: 'Lumina', minStockThreshold: 12, image: 'https://images.unsplash.com/photo-1507473888900-52e1ad1d6904?w=500&q=80' },
  { name: 'Laptop Stand', category: 'Accessories', price: 1200, stock: 60, supplier: 'ErgoLife', minStockThreshold: 15, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80' },
  { name: 'Noise Cancelling Earbuds', category: 'Audio', price: 8999, stock: 22, supplier: 'SoundWave', minStockThreshold: 5, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80' }
];

// @desc    Get all products (seeds if empty)
const getProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(INITIAL_PRODUCTS);
      console.log('✅ Seeded Products');
    }
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };