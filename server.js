// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const userController = require('./controllers/userController');

const app = express();
const PORT = process.env.PORT || 8080;

// --- Middleware ---
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',                // local frontend
    'https://moviedb3-production.up.railway.app' // deployed frontend
  ],
  credentials: true
}));

// --- MongoDB connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- User Routes ---
app.post('/api/users/signup', userController.signup);
app.post('/api/users/login', userController.login);

// --- Movies Route ---
app.get('/api/movies', async (req, res) => {
  const search = req.query.s; // get query param "s"
  if (!search) return res.status(400).json({ message: 'Search query required' });

  try {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        s: search,
        apiKey: process.env.OMDB_API_KEY,
      },
    });

    if (response.data.Response === 'False') {
      return res.status(404).json({ message: response.data.Error });
    }

    res.json(response.data.Search.slice(0, 10)); // return first 10 movies
  } catch (err) {
    console.error('Error fetching movies:', err.message);
    res.status(500).json({ message: 'Something went wrong fetching movies' });
  }
});

// --- Root Route ---
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// --- Global error handling ---
process.on('uncaughtException', err => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', err => console.error('Unhandled Rejection:', err));

// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
