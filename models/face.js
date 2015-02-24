var mongoose = require('mongoose');

var faceSchema = new mongoose.Schema({
    _id: Number,
    yammer: Object,
    timesCorrect: { type: Number, min: 0 }
});

module.exports = mongoose.model('Face', faceSchema);