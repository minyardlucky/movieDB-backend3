require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.once('open', () => {
  console.log(' MongoDB connection established successfully');
});

// Example route
app.get('/', (req, res) => {
    res.send('Hello from backend!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
