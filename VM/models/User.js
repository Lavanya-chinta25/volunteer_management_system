const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    tzId: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true }, // Added name field
    branch: { type: String, required: true },
    year: { type: Number, required: true },
    phone: { type: String, required: true },
    club: { type: String, required: true },
    role: { type: String, enum: ['Volunteer', 'Core Team', 'Admin'], required: true },
    photo: { type: String ,default:''},
    creditScore: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
