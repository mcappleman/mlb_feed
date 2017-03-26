
'user strict'

var request = require('request');
var TeamService = require('../services/TeamService');

var TeamController = {

	getOneTeam,
	getTeamList

}

module.exports = TeamController;

function getOneTeam(req, res) {

	return TeamService.findOne({ _id: req.params.id })
	.then((team) => {

		return res.send({
			status: 200,
			message: "Got that team",
			data: team
		});

	})
	.catch((err) => {

		return res.send({
			status: 500,
			message: "Something went really wrong..."
		});

	});

}

function getTeamList(req, res) {

	return TeamService.find()
	.then((teamList) => {

		return res.send({
			status: 200,
			message: "Got those teams",
			data: teamList
		});

	})
	.catch((err) => {

		return res.send({
			status: 500,
			message: "Something went really wrong..."
		});

	});
	
}