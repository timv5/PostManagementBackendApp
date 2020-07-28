const mongoose = require("mongoose");

const forgottenPassTokenShema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref:'User'},
    confirmationToken: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
    expirationDate: { type: Number, required: true }
});

module.exports = mongoose.model("ForgottenPassToken", forgottenPassTokenShema, 'ForgottenPassToken');
