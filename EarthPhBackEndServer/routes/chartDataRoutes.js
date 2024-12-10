const express = require('express');
const router = express.Router();
const chartDataController = require('../controller/chartDataController');


// Route to create new chart data
router.post('/createChartData', chartDataController.createChartData);

// Route to fetch all chart data (use GET for fetching)
router.get('/getChartData', chartDataController.getChartData);

module.exports = router;

