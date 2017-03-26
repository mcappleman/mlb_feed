'use strict';

const MLB_FEED = require('../../config/mlbFeed.js');

var request = require('request');
var TeamService = require('./TeamService');
var GameService = require('./GameService');

module.exports = {
	scrapeYear: scrapeYear
}

function scrapeYear(year) {

	if (year !== 2017 && year !== 2016) {

		var err = new Error('Invalid year. Must be 2017 or 2016 for now.');
		err.status = 400;
		throw err;

	}

	console.log(MLB_FEED);

	var startDate = new Date(MLB_FEED.years[year].startDate);
	var endDate = new Date(MLB_FEED.years[year].endDate);
	var currentDate = startDate;

	return new Promise((res, rej) => {

		iterateDates();

		function iterateDates() {

			if (currentDate > endDate) {
				return res({});
			}

			return getGamesForDay(currentDate)
			.then((games) => {

				return new Promise((resolve, reject) => {

					var index = 0;
					var gameList = [];

					iter();

					function iter() {

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

			})
			.then(() => {
				currentDate.setDate(currentDate.getDate() + 1);
				iterateDates();
			})
			.catch((err) => {
				console.log('Error!!!', err);
				return rej(err)
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

	});

}