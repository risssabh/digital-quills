// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const notifRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');

const app = express();

// ✅ Allow frontend origin for CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}));

app.use(express.json());

// ✅ Connect to DB
connectDB();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/users', userRoutes);

// default
app.get('/', (req, res) => res.send('Digital Quill API running ✅'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));
