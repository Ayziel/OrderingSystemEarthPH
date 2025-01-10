const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Ensure dotenv is configured

// Import routes
const userRoutes = require('./EarthPhBackEndServer/routes/userRoutes');
const orderRoutes = require('./EarthPhBackEndServer/routes/orderRoutes');
const productRoutes = require('./EarthPhBackEndServer/routes/productRoutes');
const chartDataRoutes = require('./EarthPhBackEndServer/routes/chartDataRoutes');
const storeRoutes = require('./EarthPhBackEndServer/routes/storeRoutes');

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '10mb' })); // Parse incoming JSON requests
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/earthph';
mongoose.connect(mongoURL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Serve static files (like index.html) from the specified folder
app.use(express.static(path.join(__dirname, 'EarthPhFrontEndWeb/Pages')));

// Root route to redirect to index.html inside 'Pages/System'
app.get('/', (req, res) => {
    res.redirect('/System/index.html');
});

// Use Routes
app.use('/users', userRoutes);
app.use('/orders', orderRoutes); 
app.use('/products', productRoutes);
app.use('/chartData', chartDataRoutes);
app.use('/stores', storeRoutes);

// Error handling middleware (if needed)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5001; // Use environment variable for port if available
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Connecting to MongoDB at: ${mongoURL}`);
});