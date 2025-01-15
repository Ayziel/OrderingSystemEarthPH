const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const fetch = require('node-fetch'); // To make API requests to Movider
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

// Movider API Configuration
const MOVIDER_API_KEY = process.env.MOVIDER_API_KEY;
const MOVIDER_API_SECRET = process.env.MOVIDER_API_SECRET;

// Route to send SMS verification code
app.post('/send-sms', async (req, res) => {
    const { phone_number } = req.body;

    try {
        const response = await fetch('https://api.movider.co/sms/verify/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MOVIDER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone_number: phone_number
            })
        });

        const data = await response.json();

        if (data.success) {
            res.json({ success: true, message: 'Verification code sent' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send code' });
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({ success: false, message: 'Server error while sending SMS' });
    }
});

// Route to verify SMS code
app.post('/verify-sms', async (req, res) => {
    const { phone_number, verification_code } = req.body;

    try {
        const response = await fetch('https://api.movider.co/sms/verify/verify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MOVIDER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone_number: phone_number,
                verification_code: verification_code
            })
        });

        const data = await response.json();

        if (data.success) {
            res.json({ success: true, message: 'Verification successful' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid code' });
        }
    } catch (error) {
        console.error('Error verifying SMS:', error);
        res.status(500).json({ success: false, message: 'Server error while verifying SMS' });
    }
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
