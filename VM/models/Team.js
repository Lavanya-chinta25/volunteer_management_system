// Team Model
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
  
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);