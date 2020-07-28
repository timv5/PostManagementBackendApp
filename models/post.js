const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    valid: { type: Boolean, required: false },
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    postNumber: { type: mongoose.Schema.Types.ObjectId, ref:'PostNumber', required: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref:'JobCategory', required: false },
    price: { type: String, required: false },
    dateControlId: { type: mongoose.Types.ObjectId, ref: 'DateControl', required: false }
});

module.exports = mongoose.model('Post', postSchema, 'Post');
