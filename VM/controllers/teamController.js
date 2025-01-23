const Team = require('../models/Team');
const { upload } = require('../config/cloudinary');

// Create a new team
exports.createTeam = async (req, res) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading image', error: err });
            }

            const { name, position } = req.body;
            console.log(name, position);
            
            const image = req.file?.path; 
            console.log(image);// Get Cloudinary URL from Multer

            if (!name || !position || !image) {
                return res.status(400).json({ message: 'Name, position, and image are required' });
            }

            const team = new Team({
                name,
                image,
                position,
            // Assuming `req.user` contains authenticated user
            });

            await team.save();

            res.status(201).json({ message: 'Team created successfully', team });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all teams
exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find()
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update team
exports.updateTeam = async (req, res) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading image', error: err });
            }

            const updateData = { ...req.body };
            if (req.file) {
                updateData.image = req.file.path; // Update the image URL from Cloudinary
            }

            const team = await Team.findByIdAndUpdate(req.params.id, updateData, { new: true });

            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }

            res.status(200).json(team);
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete team
exports.deleteTeam = async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};