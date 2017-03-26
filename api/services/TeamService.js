'use strict'

var request = require('request');
var Team = require('../models/Team');

module.exports = {
	create,
	find,
	findOne,
	findOrCreate
}

function create(team) {

	return Team.create(team);

}

function find(query) {

	return Team.find(query);

}

function findOne(query) {

	return Team.findOne(query);

}

function findOrCreate(abbrev, city, name) {

	return Team.findOne({ abbrev: abbrev, city: city, name: name })
	.then((team) => {

		if (!team) {

			return create({ abbrev: abbrev, city: city, name: name });

		}

		return team;

	});

}