const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// 🔹 Signup
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, passWord } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(passWord, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      passWord: hashedPassword,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    // ✅ Log full user info + token to terminal
    console.log('New user signed up:', {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      userName: newUser.userName,
      email: newUser.email,
      token,
    });

    // Remove password before sending
    const userWithoutPassword = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      userName: newUser.userName,
      email: newUser.email,
    };

    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔹 Login
exports.login = async (req, res) => {
  try {
    const { userName, passWord } = req.body;
    const user = await User.findOne({ userName });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(passWord, user.passWord);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // ✅ Log full user info + token to terminal
    console.log('User logged in:', {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      token,
    });

    const userWithoutPassword = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
    };

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Get logged-in user info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passWord');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};