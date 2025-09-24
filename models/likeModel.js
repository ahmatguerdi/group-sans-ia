const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema(
  {
      user_id: {
        type: String,
        required: true,
      },
    post_id: {
      type: String,
      required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Likes", likeSchema);

