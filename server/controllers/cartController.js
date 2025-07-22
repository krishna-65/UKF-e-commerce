// controllers/cartController.js
 import mongoose from 'mongoose'
import User from '../models/User.js';
import Product from '../models/Product.js';

// Add to cart or update quantity
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.params.id;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check product stock
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock available' 
      });
    }

    // Find user and update cart
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if product already in cart
    const existingItemIndex = user.cartItems.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      user.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      user.cartItems.push({ product: productId, quantity });
    }

    await user.save();

    // Populate cart items for response
    const populatedUser = await User.findById(userId)
      .populate({
        path: 'cartItems.product',
        select: 'name price images stock'
      });

    res.json({ 
      success: true,
      message: 'Product added to cart successfully',
      cart: populatedUser.cartItems
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.params.id;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { cartItems: { product: productId } } },
      { new: true }
    ).populate({
      path: 'cartItems.product',
      select: 'name price images'
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Product removed from cart',
      cart: user.cartItems
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get cart items
export const getCart = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
    }

    const user = await User.findById(userId)
      .populate({
        path: 'cartItems.product',
        select: 'name price images stock'
      });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Calculate total
    const cartTotal = user.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    res.json({ 
      success: true,
      cart: user.cartItems,
      totalItems: user.cartItems.length,
      cartTotal
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.params.id;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be at least 1' 
      });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock available' 
      });
    }

    // Update cart item quantity
    const user = await User.findOneAndUpdate(
      { 
        _id: userId,
        'cartItems.product': productId 
      },
      { $set: { 'cartItems.$.quantity': quantity } },
      { new: true }
    ).populate({
      path: 'cartItems.product',
      select: 'name price images'
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User or cart item not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Cart updated successfully',
      cart: user.cartItems
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { cartItems: [] } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


export const bulkAddToCart = async (req, res) => {
  try {
    const { items } = req.body; // Expecting array of { productId, quantity }
    const userId = req.params.id;

// If items is a string, parse it
if (typeof items === 'string') {
  try {
    items = JSON.parse(items);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid items format'
    });
  }
}


    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate input format
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items must be a non-empty array'
      });
    }

    // Validate all product IDs and quantities
    const validatedItems = [];
    const productIds = items.map(item => item.productId);
    
    // Check for duplicate product IDs in request
    const uniqueIds = [...new Set(productIds)];
    if (uniqueIds.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate product IDs in request'
      });
    }

    // Get all products at once for efficiency
    const products = await Product.find({
      _id: { $in: productIds }
    }).lean();

    // Create a map for quick product lookup
    const productMap = new Map();
    products.forEach(product => {
      productMap.set(product._id.toString(), product);
    });

    // Validate each item and prepare for processing
    for (const item of items) {
      // Validate item structure
      if (!item.productId || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have productId and quantity'
        });
      }

      // Validate quantity
      if (typeof item.quantity !== 'number' || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product ${item.productId}`
        });
      }

      // Find the product
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`
        });
      }

      validatedItems.push({
        product: item.productId,
        quantity: item.quantity,
        productData: { // Include full product data for new items
          name: product.name,
          price: product.price,
          images: product.images,
          stock: product.stock
        }
      });
    }

    // Process cart updates - only update quantity for existing items
    const updatedCart = [...user.cartItems];
    const newItems = [];
    
    for (const item of validatedItems) {
     const existingIndex = updatedCart.findIndex(
  cartItem => cartItem.product && cartItem.product.toString() === item.product
);

      

      if (existingIndex >= 0) {
        // Only update quantity if product already in cart
        updatedCart[existingIndex].quantity += item.quantity;
      } else {
        // Prepare new item with full product data
        newItems.push({
          product: item.product,
          quantity: item.quantity,
          addedAt: new Date(),
          productDetails: item.productData // Store essential product details
        });
      }
    }

    // Combine existing (updated) and new items
    user.cartItems = [...updatedCart, ...newItems];
    await user.save();

    // Return populated cart data
    const resultCart = user.cartItems.map(item => {
      // For existing items that were updated, we need to populate the product data
      if (!item.productDetails) {
        const product = productMap.get(item.product.toString());
        return {
          ...item.toObject(),
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images,
            stock: product.stock
          }
        };
      }
      // For new items, we already have the product data
      return {
        ...item.toObject(),
        product: {
          _id: item.product,
          name: item.productDetails.name,
          price: item.productDetails.price,
          images: item.productDetails.images,
          stock: item.productDetails.stock
        }
      };
    });

    // Calculate totals
    const cartTotal = resultCart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    res.status(200).json({
      success: true,
      message: 'Products added to cart successfully',
      cart: resultCart,
      totalItems: resultCart.length,
      cartTotal,
      newItemsAdded: newItems.length // Additional info about what was added
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};