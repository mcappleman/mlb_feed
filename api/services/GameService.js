'use strict'

const MLB_FEED = require('../../config/mlbFeed.js');

var request = require('request');
var Game = require('../models/Game');
var TeamService = require('./TeamService');

module.exports = {
	create,
	findDay,
	findMonth,
	findOrCreate,
	findTeamDay,
	findTeamMonth,
	findTeamYear,
	findYear
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
			status: game.status.status || 'Preview',
			inning: game.status.inning || 0,
			top_inning: game.status.top_inning === 'Y',
			gd2_id: game.id
		}

		if (game.linescore) {
			newGame.home_runs = Number(game.linescore.r.home);
			newGame.away_runs = Number(game.linescore.r.away);
		}

		return Game.create(newGame)

	});

}

function findDay(year, month, day) {

	var startDate = new Date(year,month-1,day-1,23,59,59,999);
	var endDate = new Date(year,month-1,day+1,0,0,0,0);

	var range = {
		$gt: startDate,
		$lt: endDate
	}

	return getGames(range);

}

function findTeamDay(teamAbbrev, year, month, day) {

	var startDate = new Date(year,month-1,day-1,23,59,59,999);
	var endDate = new Date(year,month-1,day+1,0,0,0,0);

	var dateRange = {
		$gt: startDate,
		$lt: endDate
	}

	return getGamesByTeam(teamAbbrev, dateRange);

}

function findMonth(year, month) {

	var startDate = new Date(year,month-1,0,23,59,59,999);
	var endDate = new Date(year,month,1,0,0,0,0);

	var range = {
		$gt: startDate,
		$lt: endDate
	}

	return getGames(range);

}

function findOrCreate(game) {

	return Game.findOne({ gd2_id: game.id })
	.then((data) => {

		if (!data) {

			return create(game);

		}

		return update(game);

	});

}

function findTeamMonth(teamAbbrev, year, month) {

	var startDate = new Date(year,month-1,0,23,59,59,999);
	var endDate = new Date(year,month,1,0,0,0,0);

	var dateRange = {
		$gt: startDate,
		$lt: endDate
	}

	return getGamesByTeam(teamAbbrev, dateRange);

}

function findTeamYear(teamAbbrev, year) {

	if (!MLB_FEED.years[year]) {
		var error = new Error('No data for given year');
		error.status = 404;
		throw error;
	}

	var startDate = new Date(MLB_FEED.years[year].startDate);
	startDate.setDate(startDate.getDate()-1);
	startDate.setHours(23);
	startDate.setMinutes(59);
	startDate.setSeconds(59);
	startDate.setMilliseconds(999);

	var endDate = new Date(MLB_FEED.years[year].endDate);
	endDate.setDate(endDate.getDate()+1);
	endDate.setHours(0);
	endDate.setMinutes(0);
	endDate.setSeconds(0);
	endDate.setMilliseconds(0);

	var dateRange = {
		$gt: startDate,
		$lt: endDate
	}

	return getGamesByTeam(teamAbbrev, dateRange);

}

function findYear(year) {

	var startDate = new Date(MLB_FEED.years[year].startDate);
	startDate.setDate(startDate.getDate()-1);
	startDate.setHours(23);
	startDate.setMinutes(59);
	startDate.setSeconds(59);
	startDate.setMilliseconds(999);

	var endDate = new Date(MLB_FEED.years[year].endDate);
	endDate.setDate(endDate.getDate()+1);
	endDate.setHours(0);
	endDate.setMinutes(0);
	endDate.setSeconds(0);
	endDate.setMilliseconds(0);

	var range = {
		$gt: startDate,
		$lt: endDate
	}

	return getGames(range);

}

function getGames(dateRange) {

	var query = {
		date: dateRange
	}

	return Game.find(query).populate('home_team away_team')
	.then((gameList) => {

		return gameList;

	});

}

function getGamesByTeam(teamAbbrev, dateRange) {

	return TeamService.findOne({ abbrev: teamAbbrev })
	.then((team) => {

		var query = { 
			$or: [{ home_team: team._id }, { away_team: team._id }],
			date: dateRange
		}

		return Game.find(query).populate('home_team away_team')

	})
	.then((gameList) => {

		return gameList;

	});

}

function update(game) {

	return Game.findOne({ gd2_id: game.id })
	.then((gameData) => {

		var home_runs, away_runs;

		if (game.linescore) {

			gameData.home_runs = Number(game.linescore.r.home);
			gameData.away_runs = Number(game.linescore.r.away);

		}

		gameData.status = game.status.status || 'Preview';
		gameData.inning = game.status.inning || 0,
		gameData.top_inning = game.status.top_inning === 'Y',

		return gameData.save();

	});

}
