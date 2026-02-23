const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, thumbnailUrl } = req.body;

    const product = new Product({
      seller: req.user._id,
      title,
      description,
      category,
      price,
      thumbnailUrl,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);
    res.status(400).json({ message: error.message || 'Invalid product data' });
  }
};

// @desc    Get all active products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).populate('seller', 'name email');
    res.json(products);
  } catch (error) {
    console.error('GET PRODUCTS ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('GET PRODUCT BY ID ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
};
