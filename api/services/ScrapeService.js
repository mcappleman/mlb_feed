'use strict'

var request = require('request');
var TeamService = require('./TeamService');
var GameService = require('./GameService');

module.exports = {
	scrapeYear: scrapeYear
}

function scrapeYear(year) {

	if (year !== 2017) {

		var err = new Error('Invalid year. Must be 2017 for now.');
		err.status = 400;
		throw err;

	}


	var currentDate = new Date(4/2/2017);

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

		})

	});

}

function getGamesForDay(date) {

	var gd2Url = `http://gd2.mlb.com/components/game/mlb/year_2017/month_04/day_02/master_scoreboard.json`;
	
	var reqOpts = {
		method: 'GET',
		url: gd2Url
	}

	return new Promise((resolve, reject) => {

		request(reqOpts, (error, response, body) => {

			if (error) { return reject(error) }

			var data = JSON.parse(body);

			resolve(data.data.games.game)

		});

	});

}