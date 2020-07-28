const mongoose = require("mongoose");

const verificationTokenShema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref:'User'},
    confirmationToken: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
    verificationDate: { type: Number, required: true },
    expirationDate: { type: Number, required: true }
});

module.exports = mongoose.model("VerificationToken", verificationTokenShema, 'VerificationToken');
