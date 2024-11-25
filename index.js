const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser'); // Add this line
// Import routes
const userRoutes = require('./EarthPhBackEndServer/routes/userRoutes');
const orderRoutes = require('./EarthPhBackEndServer/routes/orderRoutes');
const productRoutes = require('./EarthPhBackEndServer/routes/productRoutes');
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse incoming JSON requests
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/earthph')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Use Routes
app.use('/users', userRoutes);
app.use('/orders', orderRoutes); // Add the order routes
app.use('/products', productRoutes);


// Start the server
app.listen(5001, () => {
  console.log('Server started on port 5001');
});
