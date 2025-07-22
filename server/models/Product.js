// controllers/productController.js
import Product from '../models/Product.js';
import mongoose from 'mongoose';

<<<<<<< HEAD
// Helper function for building filters
const buildFilters = (query) => {
  const filters = {};
  
  // Price range filter
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
  }
  
  // Category filter
  if (query.category) {
    filters.category = mongoose.Types.ObjectId(query.category);
  }
  
  // Size filter
  if (query.size) {
    filters.size = { $in: query.size.split(',') };
  }
  
  // Color filter
  if (query.color) {
    filters.color = { $in: query.color.split(',') };
  }
  
  // Gender filter
  if (query.gender) {
    filters.gender = query.gender;
  }
  
  // Search term filter
  if (query.search) {
    filters.$text = { $search: query.search };
  }
  
  // Featured products
  if (query.featured === 'true') {
    filters.isFeatured = true;
  }
  
  // New arrivals
  if (query.newArrivals === 'true') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filters.createdAt = { $gte: thirtyDaysAgo };
    filters.isNewArrival = true;
  }
  
  // On sale products
  if (query.onSale === 'true') {
    filters.isOnSale = true;
    filters.saleStartDate = { $lte: new Date() };
    filters.saleEndDate = { $gte: new Date() };
  }
  
  return filters;
};
=======
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  sold: { type: Number, default: 0 }, // Track how much is sold
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String },
  gender:{type: String, enum: ["Male","Female","Both"], default: "Both"},
  material: { type: String} ,
  color: { type: String },
  size: { type: String },
  images: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  ratings: { type: Number, default: 0 },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String,
    }
  ],
}, { timestamps: true });
>>>>>>> 4154b35bdca5f500025e4e58a6c286c813d98056

// Create a new product
export const createProduct = async (req, res) => {
  try {
    // Generate SKU if not provided
    if (!req.body.sku) {
      const prefix = req.body.name.substring(0, 3).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      req.body.sku = `${prefix}-${randomNum}`;
    }
    
    // Generate slug if not provided
    if (!req.body.slug) {
      req.body.slug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    
    const product = new Product(req.body);
    const savedProduct = await product.save();
    
    res.status(201).json({ 
      success: true, 
      product: savedProduct 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get all products with pagination and filtering
export const getAllProducts = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Sorting
    let sort = {};
    if (req.query.sort) {
      const sortParts = req.query.sort.split(':');
      sort[sortParts[0]] = sortParts[1] === 'desc' ? -1 : 1;
    } else {
      sort = { createdAt: -1 }; // Default sort by newest
    }
    
    // Build filters
    const filters = buildFilters(req.query);
    
    // Get total count for pagination
    const total = await Product.countDocuments(filters);
    
    // Get products with filters, pagination, and sorting
    const products = await Product.find(filters)
      .populate('category')
      .populate('brand')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get single product by ID or slug
export const getProductById = async (req, res) => {
  try {
    let product;
    
    // Check if the parameter is an ID or slug
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      product = await Product.findById(req.params.id)
        .populate('category')
        .populate('brand')
        .populate('reviews.user');
    } else {
      product = await Product.findOne({ slug: req.params.id })
        .populate('category')
        .populate('brand')
        .populate('reviews.user');
    }
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    // Get related products (same category)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);
    
    res.json({ 
      success: true, 
      product,
      relatedProducts 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  try {
    // Don't allow updating SKU
    if (req.body.sku) {
      delete req.body.sku;
    }
    
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category').populate('brand');
    
    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    res.json({ 
      success: true, 
      product: updated 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({ isFeatured: true })
      .limit(limit)
      .populate('category');
    
    res.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get new arrivals
export const getNewArrivals = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({
      isNewArrival: true,
      createdAt: { $gte: thirtyDaysAgo }
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('category');
    
    res.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get products on sale
export const getProductsOnSale = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({
      isOnSale: true,
      saleStartDate: { $lte: new Date() },
      saleEndDate: { $gte: new Date() }
    })
    .sort({ discountPercentage: -1 })
    .limit(limit)
    .populate('category');
    
    res.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Add or update a review
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;
    const userId = req.user._id; // Assuming you have user auth
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    // Check if user already reviewed this product
    const existingReviewIndex = product.reviews.findIndex(
      r => r.user.toString() === userId.toString()
    );
    
    const review = {
      user: userId,
      rating: Number(rating),
      title,
      comment,
      verifiedPurchase: true // You might want to verify if user actually purchased
    };
    
    if (existingReviewIndex >= 0) {
      // Update existing review
      product.reviews[existingReviewIndex] = review;
    } else {
      // Add new review
      product.reviews.push(review);
    }
    
    // Recalculate average rating
    const totalRatings = product.reviews.reduce(
      (acc, item) => item.rating + acc, 0
    );
    product.ratings.average = totalRatings / product.reviews.length;
    
    // Update rating breakdown
    product.ratings.breakdown = {
      1: product.reviews.filter(r => r.rating === 1).length,
      2: product.reviews.filter(r => r.rating === 2).length,
      3: product.reviews.filter(r => r.rating === 3).length,
      4: product.reviews.filter(r => r.rating === 4).length,
      5: product.reviews.filter(r => r.rating === 5).length
    };
    
    product.ratings.count = product.reviews.length;
    
    await product.save();
    
    res.json({ 
      success: true, 
      product 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get product statistics
export const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          totalSold: { $sum: "$sold" },
          averagePrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          totalStock: 1,
          totalSold: 1,
          averagePrice: { $round: ["$averagePrice", 2] },
          minPrice: 1,
          maxPrice: 1
        }
      }
    ]);
    
    res.json({ 
      success: true, 
      stats: stats[0] || {} 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: "Search query is required" 
      });
    }
    
    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(10)
    .populate('category');
    
    res.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};