const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userController = require('./controllers/userController'); // adjust path if needed

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://minyardlucky.github.io/MovieDB3'
  ],
  credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes using userController
app.post('/api/users/signup', userController.signup);
app.post('/api/users/login', userController.login);

// Root route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// Error handling
process.on('uncaughtException', err => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', err => console.error('Unhandled Rejection:', err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
