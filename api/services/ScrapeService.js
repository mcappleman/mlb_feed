'use strict';

const MLB_FEED = require('../../config/mlbFeed.js');

var request = require('request');
var TeamService = require('./TeamService');
var GameService = require('./GameService');

module.exports = {
	dailyScrape,
	scrapeYear
}

function dailyScrape() {

	var startDate = new Date();
	var startSeason = new Date(MLB_FEED.years[startDate.getFullYear()].startDate);
	var endSeason = new Date(MLB_FEED.years[startDate.getFullYear()].endDate);

	startDate.setDate(startDate.getDate()-1);
	console.log(`End Date: ${endSeason}`)

	if (startDate < startSeason) {
			startDate.setDate(startDate.getDate()+1);
	}
	if (startDate > endSeason) {

			console.log("NO NO NO NO NO NO!")
		return new Promise((resolve, reject) => {resolve()});

	}

	return getGamesForDay(startDate)
	.then((games) => {

		startDate.setDate(startDate.getDate()+1);

		if (startDate > startSeason && startDate <= endSeason) {

			return getGamesForDay(startDate);

		}

	});

}

function scrapeYear(year) {

	// if (year !== 2017 && year !== 2016 && year !== 2018 && year !== 2019) {
	if (year < 2016 || year > 2020) {

		var err = new Error('Invalid year. Must be 2017 or 2016 for now.');
		err.status = 400;
		throw err;

	}

	var startDate = new Date(MLB_FEED.years[year].startDate);
	var endDate = new Date(MLB_FEED.years[year].endDate);
	var currentDate = startDate;

	return new Promise((resolve, reject) => {

		iterateDates();

		function iterateDates() {

			if (currentDate > endDate) {
				return resolve({});
			}

			console.log(currentDate.toDateString());

			return getGamesForDay(currentDate)
			.then(() => {
				currentDate.setDate(currentDate.getDate() + 1);
				iterateDates();
			})
			.catch((err) => {
				console.log('Error!!!', err);
				return reject(err)
			});

		}

	});

}

function getGamesForDay(date) {

	var d = new Date(date);
	var year = d.getFullYear();
	var month = d.getMonth()+1;
	var day = d.getDate();

	if (month < 10) {
		month = '0' + month;
	}

	if (day < 10) {
		day = '0' + day;
	}

	var gd2Url = `http://gd2.mlb.com/components/game/mlb/year_${year}/month_${month}/day_${day}/master_scoreboard.json`;
	
	var reqOpts = {
		method: 'GET',
		url: gd2Url,
		json: true
	}

	return new Promise((resolve, reject) => {

		request(reqOpts, (error, response, body) => {

			if (error) { return reject(error) }

			resolve(body.data.games.game)

		});

	})
	.then((games) => {

		return new Promise((resolve, reject) => {

			var index = 0;
			var gameList = [];

			iter();

			function iter() {

				if (!Array.isArray(games)) {
					console.log('All Star Break?', games);
					return resolve({});
				}

				if (index >= games.length) {
					return resolve(gameList);
				}

				return GameService.findOrCreate(games[index])
				.then((game) => {

					index++;
					gameList.push(game);
					iter();

				})
				.catch((err) => {
					return reject(err);
				});

			}

		});

	});

}
