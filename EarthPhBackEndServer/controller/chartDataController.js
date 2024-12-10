// Import the model
const ChartData = require('../models/chartDataModel');

// Create new chart data entry (updated version)
exports.createChartData = async (req, res) => {
    console.log('Received request to create chart data');
    try {
        // Destructure the incoming data, including the itemSales array
        const { date, totalSales, totalAmount, totalItems, totalDiscount, totalOrders, itemSales } = req.body;

        // Ensure itemSales is an array and each item has the correct structure
        if (!Array.isArray(itemSales)) {
            return res.status(400).json({ message: "itemSales should be an array" });
        }

        // Create new chart data document
        const newChartData = new ChartData({
            date,
            totalSales,
            totalAmount,
            totalItems,
            totalDiscount,
            totalOrders,
            itemSales  // Add the itemSales array to the chart data
        });
        console.log('New chart data created:', newChartData);

        // Save the new chart data
        const savedChartData = await newChartData.save();

        res.status(201).json({
            message: 'Chart data created successfully',
            chartData: savedChartData,
        });
    } catch (error) {
        console.error('Error creating chart data:', error);
        res.status(500).json({
            message: 'Error creating chart data',
            error: error.message,
        });
    }
};

// Fetch all chart data
exports.getChartData = async (req, res) => {
    try {
        const chartData = await ChartData.find(); // Retrieve all chart data
        res.status(200).json(chartData);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching chart data',
            error: error.message,
        });
    }
};
