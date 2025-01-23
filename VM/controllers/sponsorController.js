const Sponsor = require('../models/Sponsor');
const { upload } = require('../config/cloudinary');

// Create a new sponsor
exports.createSponsor = async (req, res) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading image', error: err });
            }

            const { name, type } = req.body;
            console.log(name, type);
            
            const image = req.file?.path; 
            console.log(image);// Get Cloudinary URL from Multer

            if (!name || !type || !image) {
                return res.status(400).json({ message: 'Name, type, and image are required' });
            }

            const sponsor = new Sponsor({
                name,
                image,
                type,
            // Assuming `req.user` contains authenticated user
            });

            await sponsor.save();

            res.status(201).json({ message: 'Sponsor created successfully', sponsor });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all sponsors
exports.getSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor.find()
        res.status(200).json(sponsors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update sponsor
exports.updateSponsor = async (req, res) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading image', error: err });
            }

            const updateData = { ...req.body };
            if (req.file) {
                updateData.image = req.file.path; // Update the image URL from Cloudinary
            }

            const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, updateData, { new: true });

            if (!sponsor) {
                return res.status(404).json({ message: 'Sponsor not found' });
            }

            res.status(200).json(sponsor);
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete sponsor
exports.deleteSponsor = async (req, res) => {
    try {
        await Sponsor.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Sponsor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};