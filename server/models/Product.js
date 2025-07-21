// models/Product.js
import mongoose from 'mongoose';

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

export default mongoose.model('Product', productSchema);
