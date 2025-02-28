const express = require('express');
const router = express.Router();
const teamController = require('../controller/teamController');

// Route to create or update the team
router.post('/createTeam', teamController.createTeam);

// Route to get the team
router.get('/getTeam', teamController.getTeam);

// Route to delete the team
router.delete('/deleteTeam', teamController.deleteTeam);

module.exports = router;
