const express = require('express');
const router = express.Router();
const gcashController = require('../controller/gcashController');

// Routes for GCash operations
router.post('/createGCash', gcashController.createGCash); // Create new GCash record
router.get('/getGCash/:userUid', gcashController.getGCashByUserUid); // Get GCash by userUid
router.put('/updateGCash', gcashController.updateGCash); // Update GCash record
router.get('/getAllGcash', gcashController.getAllGCash);
router.put('/sendGCash', gcashController.sendGCash);
module.exports = router;
