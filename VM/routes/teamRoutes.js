const express = require('express');
const router = express.Router();
const { createTeam, getTeams, updateTeam, deleteTeam } = require('../controllers/teamController');


router.post('/',  createTeam); // Create a new team
router.get('/',  getTeams); // Get all teams
router.put('/:id',updateTeam); // Update a team by ID
router.delete('/:id', deleteTeam); // Delete a team by ID

module.exports = router;