const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
     // required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      //required: true,
    },
    password: {
      type: String,
      minlength: 6,
      //required: true,
    },
    isVerified:{
        type: Boolean,
        default:false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;