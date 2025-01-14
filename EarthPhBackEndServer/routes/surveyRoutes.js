const express = require('express');
const router = express.Router();
const surveyController = require('../controller/surveyController');

// Route to get all surveys
router.get('/getSurveys', surveyController.getSurveys);

// Route to create a new survey
router.post('/createSurvey', surveyController.createSurvey);

// Route to get surveys by a specific product
router.get('/getSurveysByProduct/:productId', surveyController.getSurveysByProduct);

module.exports = router;
