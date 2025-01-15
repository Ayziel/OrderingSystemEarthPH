const SurveyModel = require('../models/surveyModel'); // Survey model
const Product = require('../models/productModel'); // Product model
const Store = require('../models/storeModel'); // Store model

// Controller to get all surveys
async function getSurveys(req, res) {
  console.log('GET /getSurveys route hit');
  
  try {
    // Fetch all surveys from the database and populate related product data
    const surveys = await SurveyModel.find({}).populate('selectedProducts');
    console.log("Fetched Surveys:", surveys);
    res.json({ surveys });
  } catch (err) {
    console.error('Error fetching surveys:', err);
    res.status(500).json({ message: 'Error fetching surveys', error: err });
  }
}

// Controller to create a new survey
async function createSurvey(req, res) {
  console.log('Request Body:', req.body); // Log the incoming data

  // Destructure the required fields from the request body
  const { insectControl, rodentControl, fabricSpray, airConCleaner, petCare, selectedProducts, userUid, storeName } = req.body;

  if (!insectControl || !rodentControl || !fabricSpray || !airConCleaner || !petCare) {
    return res.status(400).json({ message: 'Missing required fields in survey data' });
  }

  // Validate that selectedProducts is an array of ObjectId references to valid products
  if (selectedProducts && Array.isArray(selectedProducts)) {
    // Check if all the provided selected products exist in the Product collection
    const products = await Product.find({ '_id': { $in: selectedProducts } });
    if (products.length !== selectedProducts.length) {
      return res.status(400).json({ message: 'Some of the selected products do not exist' });
    }
  }

  // Create a new survey object
  const newSurvey = new SurveyModel({
    insectControl,
    rodentControl,
    fabricSpray,
    airConCleaner,
    petCare,
    selectedProducts,
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

// Controller to get surveys by a specific product (for example)
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
