const SurveyModel = require('../models/surveyModel'); // Survey model
const Store = require('../models/storeModel'); // Store model

// Controller to get all surveys
async function getSurveys(req, res) {
  console.log('GET /getSurveys route hit');
  
  try {
    // Fetch all surveys from the database
    const surveys = await SurveyModel.find({});
    console.log("Fetched Surveys:", surveys);
    res.json({ surveys });
  } catch (err) {
    console.error('Error fetching surveys:', err);
    res.status(500).json({ message: 'Error fetching surveys', error: err });
  }
}

// Controller to create a new survey
async function createSurvey(req, res) {
  console.log('Request Body:', req.body); // Log incoming data

  // Destructure the required fields from the request body
  const { lionTigerCoil, bayconCoil, otherBrandsCoil, arsCoil, userUid, storeName } = req.body;

  if (lionTigerCoil === undefined || bayconCoil === undefined || otherBrandsCoil === undefined || arsCoil === undefined) {
    return res.status(400).json({ message: 'Missing required fields in survey data' });
  }

  // Create a new survey object
  const newSurvey = new SurveyModel({
    lionTigerCoil,
    bayconCoil,
    otherBrandsCoil,
    arsCoil,
    userUid,
    storeName
  });

  try {
    // Save the new survey to the database
    await newSurvey.save();
    res.json({ message: 'Survey created successfully', survey: newSurvey });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error creating survey', error: err });
  }
}

async function getSurveysByProduct(req, res) {
  const { productId } = req.params;

  try {
    // Fetch surveys where the selected product is included
    const surveys = await SurveyModel.find({ selectedProducts: productId }).populate('selectedProducts');
    res.json({ surveys });
  } catch (err) {
    console.error('Error fetching surveys by product:', err);
    res.status(500).json({ message: 'Error fetching surveys by product', error: err });
  }
}

module.exports = { getSurveys, createSurvey, getSurveysByProduct };
