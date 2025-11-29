const Customer = require('../models/Customer');

const INITIAL_CUSTOMERS = [
  { name: 'Dev', email: 'dev@example.com', phone: '9876543210', address: '123 Tech Park, Bangalore', totalSpent: 18498 },
  { name: 'Nitin', email: 'nitin@example.com', phone: '9876543211', address: '456 Green Valley, Pune', totalSpent: 8850 },
  { name: 'Akash', email: 'akash@example.com', phone: '9876543212', address: '789 Blue Ridge, Mumbai', totalSpent: 0 },
];

const getCustomers = async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    if (count === 0) {
      await Customer.insertMany(INITIAL_CUSTOMERS);
      console.log('✅ Seeded Customers');
    }
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getCustomers, createCustomer };