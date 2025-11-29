
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Customer = require('../models/Customer');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. Create User (For Authentication)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer'
    });

    // 2. If role is Customer, ALSO create a Customer Record (For Business Data)
    if (user && role === 'customer') {
        // Check if customer profile exists to avoid duplicates
        const customerExists = await Customer.findOne({ email });
        if (!customerExists) {
            await Customer.create({
                name,
                email,
                phone: phone || '',
                address: address || '',
                totalSpent: 0
            });
        }
    }

    if (user) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
      );

      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    // --- DEMO LOGIC: Auto-Seed User if missing ---
    if (!user) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      let name = 'New User';
      let role = 'customer';

      if (email === 'admin@nexus.com' || email === 'admin@kpstore.com') {
        name = 'Admin User';
        role = 'admin';
      } else if (email === 'dev@example.com') {
        name = 'Dev';
        role = 'customer';
      } else if (email === 'nitin@example.com') {
        name = 'Nitin';
        role = 'customer';
      } else if (email === 'akash@example.com') {
        name = 'Akash';
        role = 'customer';
      }

      user = await User.create({ name, email, password: hashedPassword, role });
    }
    // ---------------------------------------------

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { loginUser, registerUser };