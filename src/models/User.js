const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchaseHistory: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Order' 
    },
  ],
  subscription: Object,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;