const express = require('express');
const router = express.Router();
const areaController = require('../controller/areaController');

// Route to create a new area
router.post('/createArea', areaController.createArea);

// Route to fetch all areas
router.get('/getAreas', areaController.getAreas);

// Route to delete an area by ID
router.delete('/deleteArea/:areaId', areaController.deleteArea);

module.exports = router;
