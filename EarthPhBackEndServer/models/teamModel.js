const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
});

const TeamModel = mongoose.model('Team', teamSchema);

module.exports = TeamModel;
