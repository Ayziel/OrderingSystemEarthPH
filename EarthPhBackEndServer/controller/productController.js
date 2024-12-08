const ProductModel = require('../models/productModel');

// Controller to get all products
async function getProduct(req, res) {
    console.log('GET /getProducts route hit');
  
    try {
      const products = await ProductModel.find({});  // This fetches all products from the database
      console.log("Fetched Products:", products);
      res.json({ products });  // Return the products as JSON
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: 'Error fetching products', error: err });
    }
  }

// Controller to create a new product
async function createProduct(req, res) {
    console.log('Request Body:', req.body); // Log the incoming data

    const { productSKU, productName, productDescription, brand, productCategory, price, quantity, productImage } = req.body;

    // Create a new product instance
    const newProduct = new ProductModel({
      productSKU,
      productName,
      productDescription,
      brand,
      productCategory,
      price: parseFloat(price), // Convert the price to a float
      quantity,
      productImage, // Save the Base64 image string
    });

    console.log('New Product:', newProduct);

    try {
      // Save the new product to the database
      await newProduct.save();
      res.json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ message: 'Error creating product', error: err });
    }
}

  

module.exports = { getProduct, createProduct };
