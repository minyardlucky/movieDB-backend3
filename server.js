require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// --- Define User model ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Example route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// --- Signup route ---
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Save user to DB
    const user = await User.create({ email, password });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

