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

async function createProduct(req, res) {
  console.log('Request Body:', req.body); // Log the incoming data

  const { productSKU, productName, productDescription, brand, productCategory, price, discount, quantity, productImage } = req.body;

  // Create a new product instance
  const newProduct = new ProductModel({
      productSKU,
      productName,
      productDescription,
      brand,
      productCategory,
      price: parseFloat(price), // Convert the price to a float
      discount: parseFloat(discount) || 0, // Default discount to 0 if not provided
      quantity,
      productImage, // Save the Base64 image string
  });

  console.log('New Product:', newProduct);

  try {
      // Save the new product to the database
      await newProduct.save();
      res.json({ 
          message: 'Product created successfully', 
          product: {
              ...newProduct.toObject(),
              finalPrice: newProduct.price - (newProduct.price * (newProduct.discount / 100))
          }
      });
  } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ message: 'Error creating product', error: err });
  }
}

async function updateProduct(req, res) {
  console.log('PUT /updateProduct route hit');

  const { productSKU, productName, productDescription, brand, price, discount } = req.body;

  try {
      // Find the product by SKU (or another identifier) and update the fields
      const updatedProduct = await ProductModel.findOneAndUpdate(
          { productSKU },  // Search criteria (e.g., productSKU)
          { 
              productName,
              productDescription,
              brand,
              price: parseFloat(price),  // Ensure price is a float
              discount: parseFloat(discount) || 0  // Default discount to 0 if not provided
          },
          { new: true }  // Return the updated document
      );

      if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ 
          message: 'Product updated successfully', 
          product: {
              ...updatedProduct.toObject(),
              finalPrice: updatedProduct.price - (updatedProduct.price * (updatedProduct.discount / 100))
          }
      });
  } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Error updating product', error: err });
  }
}


module.exports = { getProduct, createProduct, updateProduct };
