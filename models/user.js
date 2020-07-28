const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
    phone: { type: String, required: false, unique: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    workerAvg: { type: Number, required: false },
    employeeAvg: { type: Number, required: false },
    postNumber: { type: mongoose.Schema.Types.ObjectId, ref:'PostNumber', required: true },
    post: [{ type: mongoose.Schema.Types.ObjectId, ref:'Post', required: false }],
    rate: [{ type: mongoose.Schema.Types.ObjectId, ref:'Rate', required: false }],
    imagePath: { type: String, required: false },
    isActivated: { type: Boolean, required: false }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema, 'User');
