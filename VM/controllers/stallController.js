const Stall = require('../models/Stall');
const { upload } = require('../config/cloudinary');

// Create a new stall
exports.createStall = async (req, res) => {
    try {
        // Use Multer to upload the image to Cloudinary
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading image', error: err });
            }

            // Extract stall details from request
            const { name, position } = req.body;
            const image = req.file?.path; // Get Cloudinary URL from Multer

            if (!name || !position || !image) {
                return res.status(400).json({ message: 'Name, position, and image are required' });
            }

            // Create a new stall with the authenticated user's ID as createdBy
            const stall = new Stall({
                name,
                image,
                position,
                createdBy: req.user._id, // Assuming `req.user` contains authenticated user
            });

            // Save stall to the database
            await stall.save();

            res.status(201).json({ message: 'Stall created successfully', stall });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all stalls
exports.getStalls = async (req, res) => {
    try {
        // Populate createdBy to get user details
        const stalls = await Stall.find().populate('createdBy', 'name email'); 
        res.status(200).json(stalls);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update stall
exports.updateStall = async (req, res) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading image', error: err });
            }

            const updateData = { ...req.body };
            if (req.file) {
                updateData.image = req.file.path; // Update the image URL from Cloudinary
            }

            const stall = await Stall.findByIdAndUpdate(req.params.id, updateData, { new: true });

            if (!stall) {
                return res.status(404).json({ message: 'Stall not found' });
            }

            res.status(200).json(stall);
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Delete stall
exports.deleteStall = async (req, res) => {
    try {
        await Stall.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Stall deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
