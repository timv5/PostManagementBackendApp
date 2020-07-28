const mongoose = require("mongoose");

const dateControl = mongoose.Schema({
    dateTimeFrom: { type: Date, required: false },
    dateTimeTo: { type: Date, required: false },
    dateTimeCreated: { type: Date, required: false },
    dateTimeEdited: { type: Date, required: false }
});

module.exports = mongoose.model('DateControl', dateControl, 'DateControl');
