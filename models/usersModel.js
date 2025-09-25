const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);