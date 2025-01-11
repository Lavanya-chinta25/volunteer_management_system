const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser()); // To parse cookies

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stalls', require('./routes/stallRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));//push ed again
console.log("hi");