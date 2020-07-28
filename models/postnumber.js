const mongoose = require('mongoose');

const postNumberSchema = mongoose.Schema({
    city: { type: String, required: true },
    number: { type: String, required: true }
});

module.exports = mongoose.model('PostNumber', postNumberSchema, 'PostNumber');
