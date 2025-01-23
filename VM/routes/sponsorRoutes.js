const express = require('express');
const router = express.Router();
const { createSponsor, getSponsors, updateSponsor, deleteSponsor} = require('../controllers/sponsorController');


router.post('/',  createSponsor); // Create a new SponsorcreateSponsor
router.get('/',  getSponsors); // Get all SponsorcreateSponsors
router.put('/:id',updateSponsor); // Update a team by ID
router.delete('/:id', deleteSponsor); // Delete a team by ID

module.exports = router;