const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user_id: {
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

module.exports = mongoose.model("Posts", postSchema);

