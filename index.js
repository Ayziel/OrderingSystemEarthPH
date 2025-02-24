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
const surveyRoutes = require('./EarthPhBackEndServer/routes/surveyRoutes');
const stockRoutes = require('./EarthPhBackEndServer/routes/stockRoutes');
const gCashRoutes = require('./EarthPhBackEndServer/routes/gcashMoneyRoutes');
const viewStoreRoutes = require('./EarthPhBackEndServer/routes/viewStoreRoutes');
const StockModel = require('./EarthPhBackEndServer/models/stockModel');

const app = express();

app.use(cors()); // Fully open CORS policy

app.use(express.json({ limit: '10mb' })); // Parse incoming JSON requests
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/earthph';
mongoose.connect(mongoURL)
.then(() => {
  console.log('MongoDB Connected');

  // Start scheduling once connected
  scheduleDailyReset();
})
  .catch(err => console.log('MongoDB connection error:', err));

// Serve static files (like index.html) from the specified folder
app.use(express.static(path.join(__dirname, 'EarthPhFrontEndWeb/Pages')));

// Root route to redirect to index.html inside 'Pages/System'
app.get('/', (req, res) => {
    res.redirect('/System/index.html');
});

app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve manifest and service worker
app.get("/service-worker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "service-worker.js"));
});

app.get("/manifest.json", (req, res) => {
    res.sendFile(path.resolve(__dirname, "manifest.json"));
});

// Use Routes
app.use('/users', userRoutes);
app.use('/orders', orderRoutes); 
app.use('/products', productRoutes);
app.use('/chartData', chartDataRoutes);
app.use('/stores', storeRoutes);
app.use('/survey', surveyRoutes);
app.use('/stocks', stockRoutes);
app.use('/gcash', gCashRoutes);
app.use('/viewStoreRoutes', viewStoreRoutes);

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


// --- Scheduling Code ---
// Define how many milliseconds in a day
const ONE_DAY = 24 * 60 * 60 * 1000;

// Function to reset all stock quantities to 0
async function resetStockQuantities() {
  try {
    await StockModel.updateMany({}, { quantity: 0}); // Reset both fields
    console.log('✅ Reset all stock quantities and stock to 0');
  } catch (error) {
    console.error('❌ Error resetting stocks:', error);
  }
}

// Calculate delay until next midnight
function scheduleDailyReset() {
  const now = new Date();
  const nextMidnight = new Date(now);
  
  // Ensure we're setting it for the next day at 00:00:00
  nextMidnight.setDate(now.getDate() + 1);
  nextMidnight.setHours(0, 0, 0, 0);

  const delay = nextMidnight.getTime() - now.getTime(); // Ensure correct delay calculation

  console.log(`Next reset scheduled in ${delay / 1000 / 60} minutes (${delay} ms)`);

  setTimeout(() => {
    resetStockQuantities();
    setInterval(resetStockQuantities, ONE_DAY);
  }, delay);
}
