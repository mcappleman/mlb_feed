'use strict'

var TeamController = require('../controllers/TeamController.js');

module.exports = function(app) {

	app.get('/team/:id', TeamController.getOneTeam);

	app.get('/team', TeamController.getTeamList)

}