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
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Likes", likeSchema);

