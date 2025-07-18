// Create a new product
import Product from '../models/Product.js';
import { uploadImageToCloudinary } from '../utils/imageUploader.js';

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand, isFeatured } = req.body;

    const imageFiles = req.files?.images;

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    // Support both single and multiple images
    const imageArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];

    const uploadedImages = [];

    for (const file of imageArray) {
      const cloudRes = await uploadImageToCloudinary(file, 'UKF-Products');
      uploadedImages.push(cloudRes.secure_url);
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      brand,
      isFeatured,
      images: uploadedImages,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct,
      message: 'Product created with images',
    });

  } catch (error) {
    console.error('Product creation error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand, isFeatured } = req.body;

    let uploadedImages = [];

    const imageFiles = req.files?.images;

    if (imageFiles) {
      const imageArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];

      for (const file of imageArray) {
        const cloudRes = await uploadImageToCloudinary(file, 'UKF-Products');
        uploadedImages.push(cloudRes.secure_url);
      }
    }

    const updatePayload = {
      name,
      description,
      price,
      stock,
      category,
      brand,
      isFeatured,
    };

    if (uploadedImages.length > 0) {
      updatePayload.images = uploadedImages;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product: updated });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};


// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
