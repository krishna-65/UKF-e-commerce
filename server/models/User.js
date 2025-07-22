import mongoose from "mongoose";



const cartItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });


const userSchema = new mongoose.Schema({
    name: {type: String, required: true },
    phone: {type: Number, required: true, unique: true,minlength: 10, maxlength: 10 },
    password: {type: String, required: true },
    image:{type:String},
    accountType: {type: String, default: 'user'},
     cartItems: [cartItemSchema],
}, {minimize: false})

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User