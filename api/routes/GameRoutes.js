'use strict'

var GameController = require('../controllers/GameController.js');

module.exports = function(app) {

	app.get('/scrape/daily', GameController.dailyScrape);

	app.get('/scrape/year/:fullYear', GameController.scrapeYear);

	app.get('/games/year/:year', GameController.getYear);
	app.get('/games/team/year/:year', GameController.getYearByTeam);

	app.get('/games/month/:year/:month', GameController.getMonth);
	app.get('/games/team/month/:team/:year/:month', GameController.getMonthByTeam);

	app.get('/games/day/:year/:month/:day', GameController.getDay);
	app.get('/games/team/day/:team/:year/:month/:day', GameController.getDayByTeam);

}