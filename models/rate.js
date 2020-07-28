const mongoose = require('mongoose');

const rateSchema = mongoose.Schema({
    workerRate: { type: String, required: false },
    employeeRate: { type: String, required: false }
});

module.exports = mongoose.model('Rate', rateSchema, 'Rate');
