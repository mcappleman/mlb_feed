'use strict'

var request = require('request');
var Game = require('../models/Game');
var TeamService = require('./TeamService');

module.exports = {
	create,
	findMonth,
	findOrCreate,
	findTeamMonth
}

function create(game) {

	var homeTeam;

	return TeamService.findOrCreate(game.home_name_abbrev, game.home_team_city, game.home_team_name)
	.then((team) => {

		homeTeam = team;

		return TeamService.findOrCreate(game.away_name_abbrev, game.away_team_city, game.away_team_name);

	})
	.then((awayTeam) => {

		var dateSplit = game.original_date.split('/');
		var dateString = `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`;

		var newGame = {
			date: new Date(`${dateString} ${game.time} ${game.ampm}`),
			home_team: homeTeam._id,
			away_team: awayTeam._id,
			home_runs: 0,
			away_runs: 0,
			gd2_id: game.id
		}

		if (game.linescore) {
			newGame.home_runs = Number(game.linescore.r.home);
			newGame.away_runs = Number(game.linescore.r.away);
		}

		return Game.create(newGame)

	});

}

function findMonth(year, month) {

	var startDate = new Date(2017,0,1,23,59,59,999);
	startDate.setFullYear(year);
	startDate.setMonth(month-1);
	startDate.setDate(0);

	var endDate = new Date(2017,0,1,0,0,0,0);
	endDate.setFullYear(year);
	endDate.setMonth(month);
	endDate.setDate(1);

	var query = {
		date: { $gt: startDate, $lt: endDate }
	}

	return Game.find(query).populate('home_team away_team')
	.then((gameList) => {

		return gameList;

	});

}

function findOrCreate(game) {

	return Game.findOne({ gd2_id: game.id })
	.then((data) => {

		if (!data) {

			return create(game);

		}

		return data;

	});

}

function findTeamMonth(teamAbbrev, year, month) {

	var startDate = new Date(2017,0,1,23,59,59,999);
	startDate.setFullYear(year);
	startDate.setMonth(month-1);
	startDate.setDate(0);

	var endDate = new Date(2017,0,1,0,0,0,0);
	endDate.setFullYear(year);
	endDate.setMonth(month);
	endDate.setDate(1);

	return TeamService.findOne({ abbrev: teamAbbrev })
	.then((team) => {

		var query = { 
			$or: [{ home_team: team._id }, { away_team: team._id }],
			date: { $gt: startDate, $lt: endDate }
		}

		return Game.find(query).populate('home_team away_team')

	})
	.then((gameList) => {

		return gameList;

	});

}