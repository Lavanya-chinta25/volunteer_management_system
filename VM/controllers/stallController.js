const Stall = require('../models/Stall');

exports.createStall = async (req, res) => {
    const { name, image, position } = req.body;
    try {
        const stall = new Stall({ name, image, position });
        await stall.save();
        res.status(201).json({ message: 'Stall created successfully', stall });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStalls = async (req, res) => {
    try {
        const stalls = await Stall.find();
        res.status(200).json(stalls);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateStall = async (req, res) => {
    try {
        const stall = await Stall.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(stall);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteStall = async (req, res) => {
    try {
        await Stall.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Stall deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
