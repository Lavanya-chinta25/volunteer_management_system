/* eslint-disable no-undef */
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allow credentials (cookies, etc.)
}));

app.use(express.json());
app.use(cookieParser()); // To parse cookies

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stalls', require('./routes/stallRoutes'));
app.use('/api/teams',require('./routes/teamRoutes'));
app.use('/api/sponsors',require('./routes/sponsorRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));//push ed again
console.log("hi");