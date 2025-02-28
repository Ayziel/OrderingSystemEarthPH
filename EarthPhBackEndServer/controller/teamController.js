const TeamModel = require('../models/teamModel');

// Controller to get the team (there should only be one)
// Controller to get the team (returns an array of teams, even if there is only one)
async function getTeam(req, res) {
  console.log('GET /getTeam route hit');
  
  try {
    const teams = await TeamModel.find({}); // Find all teams (even if it's just one)
    if (teams.length === 0) {
      return res.status(404).json({ message: 'No teams found' });
    }
    console.log("Fetched Teams:", teams);
    res.json({ teams }); // Return teams as an array
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ message: 'Error fetching teams', error: err });
  }
}


// Controller to create or update the team (only one team allowed)
async function createOrUpdateTeam(req, res) {
  console.log('Request Body:', req.body);

  const { teamName } = req.body;

  if (!teamName) {
    return res.status(400).json({ message: 'Missing required field: teamName' });
  }

  // If the team already exists, update it; otherwise, create a new one
  try {
    let team = await TeamModel.findOne({});
    
    if (team) {
      // Update existing team
      team.teamName = teamName;
      await team.save();
      return res.json({ message: 'Team updated successfully', team });
    }

    // If no team exists, create one
    const newTeam = new TeamModel({
      teamName,
    });
    await newTeam.save();
    res.json({ message: 'Team created successfully', team: newTeam });
  } catch (err) {
    console.error('❌ MongoDB Save Error:', err.message);
    res.status(500).json({ message: 'Error creating or updating team', error: err.message });
  }
}

// Controller to delete the team (if allowed, but should only be one team)
async function deleteTeam(req, res) {
  console.log('DELETE /deleteTeam route hit');

  try {
    const deletedTeam = await TeamModel.findOneAndDelete({});
    
    if (!deletedTeam) {
      return res.status(404).json({ message: 'No team found to delete' });
    }

    res.json({
      message: 'Team deleted successfully',
      team: deletedTeam,
    });
  } catch (err) {
    console.error('Error deleting team:', err);
    res.status(500).json({ message: 'Error deleting team', error: err });
  }
}

module.exports = { getTeam, createOrUpdateTeam, deleteTeam };
