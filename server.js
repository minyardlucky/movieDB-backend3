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

// --- Movies Search Route ---
// Handles /api/movies?s=query to get a list of results
app.get('/api/movies', async (req, res) => {
  const search = req.query.s; // get query param "s"
  if (!search) return res.status(400).json({ message: 'Search query required' });

  try {
   const response = await axios.get('https://www.omdbapi.com/', {
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


// --- Movies Details Route ---
// Handles /api/movies/:imdbId to get details for a single movie
app.get('/api/movies/:imdbId', async (req, res) => {
    const imdbId = req.params.imdbId; // Get the IMDB ID from the URL parameter

    if (!imdbId) {
       return res.status(400).json({ message: 'IMDB ID required' });
   }

    try {
       // Use HTTPS and the 'i' parameter for details
       const response = await axios.get('https://www.omdbapi.com/', {
        params: {
             i: imdbId, // Use 'i' for ID lookup
              plot: 'full',
              apiKey: process.env.OMDB_API_KEY,
          },
        });

      if (response.data.Response === 'False') {
      return res.status(404).json({ message: response.data.Error });
      }

       // Return the full movie details object
      res.json(response.data); 
     } catch (err) {
       console.error(`Error fetching movie details for ${imdbId}:`, err.message);
     // Ensure you don't expose your API key details in the error response
      res.status(500).json({ message: 'Something went wrong fetching movie details' });
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
