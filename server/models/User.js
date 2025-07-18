import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true },
    phone: {type: Number, required: true, unique: true,minlength: 10, maxlength: 10 },
    password: {type: String, required: true },
    image:{type:String},
    accountType: {type: String, default: 'user'},
    cartItems: {type: Object, default: {} },
}, {minimize: false})

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User