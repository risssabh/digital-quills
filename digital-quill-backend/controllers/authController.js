// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: 'Invalid username (letters, numbers, _ and . only)' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'Username or email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`;
    const user = new User({ firstName, lastName, fullName, username: username.toLowerCase(), email: email.toLowerCase(), password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, username: user.username, email: user.email, firstName, lastName, fullName }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = username or email
    if (!identifier || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }] });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, fullName: user.fullName }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
