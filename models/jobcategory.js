const mongoose = require('mongoose');

const jobCategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    numberOfUsage: { type: Number, required: true }
});

module.exports = mongoose.model('JobCategory', jobCategorySchema, 'JobCategory');
