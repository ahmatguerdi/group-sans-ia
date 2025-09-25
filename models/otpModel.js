const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uers",
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    otpToken: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ["verify email", "reset password"],
        required: true
    },
},
    { teamstamps: true }

);

const otpModel = mongoose.model("Otp", otpSchema);

module.exports = otpModel;