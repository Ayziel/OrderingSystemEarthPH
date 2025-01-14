const express = require('express');
const router = express.Router();
const gcashController = require('../controllers/gcashController');

// Create a new gCash entry
router.post('/gcash', gcashController.createGcash);

// Show gCash entry for a specific userUid
router.get('/gcash/:userUid', gcashController.showGcash);

// Update gCash entry for a specific userUid
router.put('/gcash/:userUid', gcashController.updateGcash);

module.exports = router;
