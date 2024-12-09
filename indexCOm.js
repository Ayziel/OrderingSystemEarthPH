const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const userRoutes = require('./EarthPhBackEndServer/routes/userRoutes');
const orderRoutes = require('./EarthPhBackEndServer/routes/orderRoutes');
const productRoutes = require('./EarthPhBackEndServer/routes/productRoutes');
// const storeRoutes = require('./EarthPhBackEndServer/routes/storeRoutes');

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse incoming JSON requests
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));



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
// app.use('/stores', storeRoutes);

// Start the server
app.listen(5001, () => {
  console.log('Server started on port 5001');
});
