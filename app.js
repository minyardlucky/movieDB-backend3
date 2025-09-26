const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/userRouter');

const app = express();

// 🔹 Enable CORS only for frontend
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// 🔹 Routes
app.use('/api/users', userRouter);

module.exports = app;
