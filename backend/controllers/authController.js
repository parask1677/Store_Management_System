const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

      if (email === 'admin@nexus.com') {
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

module.exports = { loginUser };