const path = require('path');
const express = require('express');
const mongoose = require('mongoose'); // Keep this line only once
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const userRoutes = require('./EarthPhBackEndServer/routes/userRoutes');
const orderRoutes = require('./EarthPhBackEndServer/routes/orderRoutes');
const productRoutes = require('./EarthPhBackEndServer/routes/productRoutes');
const chartDataRoutes = require('./EarthPhBackEndServer/routes/chartDataRoutes');
// const surveyDataRoutes = require('./EarthPhBackEndServer/routes/surveyRoutes');
// const storeRoutes = require('./EarthPhBackEndServer/routes/storeRoutes');

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse incoming JSON requests
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB (ensure mongoose is already imported at the top)
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/earthph';
mongoose.connect(mongoURL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));



// Serve static files (like index.html) from the specified folder
// Serve static files from 'Pages' directory
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
// app.use('/survey')

// app.use('/stores', storeRoutes);

// Start the server
app.listen(5001, () => {
  console.log('Server started on port 5001');
  console.log(`Connecting to MongoDB at: ${mongoURL}`);
});
