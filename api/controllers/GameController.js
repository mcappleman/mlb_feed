'user strict'

var request = require('request');
var Game = require('../models/Game');
var ScrapeService = require('../services/ScrapeService');

var GameController = {

	dailyScrape: dailyScrape,
	getYear: getYear

}

module.exports = GameController;

function dailyScrape(req, res) {

}

function getYear(req, res) {

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