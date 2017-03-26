'user strict'

var GameService = require('../services/GameService');
var ScrapeService = require('../services/ScrapeService');

var GameController = {

	dailyScrape,
	getMonth,
	getMonthByTeam,
	scrapeYear

}

module.exports = GameController;

function dailyScrape(req, res) {

}

function getMonth(req, res) {

	var month = Number(req.params.month);
	var year = Number(req.params.year);

	return GameService.findMonth(year, month)
	.then((data) => {

		res.send({
			status: 200,
			message: "Got that data",
			data: data
		});

	})
	.catch((err) => {

		console.log(err);

		res.send({
			status: 500,
			message: err
		});

	});

}

function getMonthByTeam(req, res) {

	var team = req.params.team;
	var month = Number(req.params.month);
	var year = Number(req.params.year);

	return GameService.findTeamMonth(team, year, month)
	.then((data) => {

		res.send({
			status: 200,
			message: "Got that data",
			data: data
		});

	})
	.catch((err) => {

		console.log(err);

		res.send({
			status: 500,
			message: err
		});

	});

}

function scrapeYear(req, res) {

	var year = Number(req.params.fullYear);

	return ScrapeService.scrapeYear(year)
	.then((data) => {

		res.send({
			status: 200,
			message: "Got that data"
		});

	})
	.catch((err) => {

		res.send({
			status: 500,
			message: err
		});

	});

}