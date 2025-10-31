require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());

// Allow frontend requests (local + GitHub Pages)
app.use(cors({
  origin: [
    'http://localhost:5173', // local frontend
    'https://minyardlucky.github.io/MovieDB3' // deployed frontend
  ],
  credentials: true
}));

// --- MongoDB connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Define User model ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// --- Routes ---

// Root route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error('Error in /api/signup:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// --- Global error handling for unhandled exceptions ---
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

