'user strict'

var GameService = require('../services/GameService');
var ScrapeService = require('../services/ScrapeService');

var GameController = {

	dailyScrape,
	getDay,
	getDayByTeam,
	getMonth,
	getMonthByTeam,
	getYear,
	getYearByTeam,
	scrapeYear

}

module.exports = GameController;

function dailyScrape(req, res) {

	return ScrapeService.dailyScrape()
	.then((data) => {

		res.send({
			status: 200,
			message: 'Got that data'
		});

	})
	.catch((err) => {

		res.send({
			status: 500,
			error: err
		});

	});

}

function getDay(req, res) {

	var day = Number(req.params.day);
	var month = Number(req.params.month);
	var year = Number(req.params.year);

	return GameService.findDay(year, month, day)
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

function getDayByTeam(req, res) {

	var team = req.params.team;
	var day = Number(req.params.day);
	var month = Number(req.params.month);
	var year = Number(req.params.year);

	return GameService.findTeamDay(team, year, month, day)
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

function getYear(req, res) {

	var year = Number(req.params.year);

	return GameService.findYear(year)
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

function getYearByTeam(req, res) {

	var team = req.params.team;
	var year = Number(req.params.year);

	return GameService.findTeamMonth(team, year)
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