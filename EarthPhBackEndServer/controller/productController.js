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
  
    // Destructure the incoming data
    const { 
      productSKU, 
      productName, 
      productDescription, 
      brand, 
      productCategory, 
      price, 
      discount, 
      size, 
      storeName, 
      productImage, 
      manufacturer,
      bundle,
      free,
      uid, 
      storeUid
    } = req.body;
  
    // Ensure `storeName` and `storeUid` are arrays
    const storeNameArray = Array.isArray(storeName) ? storeName : [storeName];
    const storeUidArray = Array.isArray(storeUid) ? storeUid : [storeUid];
  
    // Create a new product instance
    const newProduct = new ProductModel({
      productSKU,
      productName,
      productDescription,
      brand,
      productCategory,
      price: parseFloat(price), // Convert the price to a float
      discount: parseFloat(discount) || 0, // Default discount to 0 if not provided
      manufacturer,
      bundle,
      free,
      storeName: storeNameArray, // Assign the array
      uid,
      storeUid: storeUidArray, // Assign the array
      size,
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
          finalPrice: newProduct.price - (newProduct.price * (newProduct.discount / 100)), // Calculate final price
        }
      });
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ message: 'Error creating product', error: err });
    }
}
  

//Needs testing
async function updateProduct(req, res) {
    console.log('PUT /updateProduct route hit');
  
    const { productSKU, productName, productDescription, brand, price, discount, productImage } = req.body;
  
    // Input validation
    if (!productSKU || !productName || !price) {
      return res.status(400).json({ message: 'Missing required fields: productSKU, productName, and price are required' });
    }
  
    if (isNaN(price) || (discount && isNaN(discount))) {
      return res.status(400).json({ message: 'Price and discount must be valid numbers' });
    }
  
    try {
      // Find the product by SKU (or another identifier) and update the fields
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { productSKU },  // Search criteria (e.g., productSKU)
        { 
          productName,
          productDescription,
          brand,
          price: parseFloat(price),  // Ensure price is a float
          discount: parseFloat(discount) || 0,  // Default discount to 0 if not provided
          productImage  // Update product image if provided
        },
        { new: true }  // Return the updated document
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Calculate final price after discount
      const finalPrice = updatedProduct.price - (updatedProduct.price * (updatedProduct.discount / 100));
  
      res.json({ 
        message: 'Product updated successfully', 
        product: {
          ...updatedProduct.toObject(),
          finalPrice: finalPrice.toFixed(2)  // Optionally format to 2 decimal places
        }
      });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Error updating product', error: err });
    }
  }
  

// async function updateProduct(req, res) {
//   console.log('PUT /updateProduct route hit');

//   const { productSKU, productName, productDescription, brand, price, discount } = req.body;

//   try {
//       // Find the product by SKU (or another identifier) and update the fields
//       const updatedProduct = await ProductModel.findOneAndUpdate(
//           { productSKU },  // Search criteria (e.g., productSKU)
//           { 
//               productName,
//               productDescription,
//               brand,
//               price: parseFloat(price),  // Ensure price is a float
//               discount: parseFloat(discount) || 0  // Default discount to 0 if not provided
//           },
//           { new: true }  // Return the updated document
//       );

//       if (!updatedProduct) {
//           return res.status(404).json({ message: 'Product not found' });
//       }

//       res.json({ 
//           message: 'Product updated successfully', 
//           product: {
//               ...updatedProduct.toObject(),
//               finalPrice: updatedProduct.price - (updatedProduct.price * (updatedProduct.discount / 100))
//           }
//       });
//   } catch (err) {
//       console.error('Error updating product:', err);
//       res.status(500).json({ message: 'Error updating product', error: err });
//   }
// }


async function deleteProduct(req, res) {
    console.log('DELETE /deleteProduct route hit');

    const { productName, productDescription, productBrand } = req.body; // Accepting all three fields

    try {
        // Find the product by all three fields and delete it
        const deletedProduct = await ProductModel.findOneAndDelete({
            productName,
            productDescription,
            productBrand
        });

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ 
            message: 'Product deleted successfully',
            product: deletedProduct // Optional: Include the deleted product details
        });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Error deleting product', error: err });
    }
}

  


module.exports = { getProduct, createProduct, updateProduct, deleteProduct };