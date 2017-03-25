'use strict'

var GameController = require('../controllers/GameController.js');

module.exports = function(app) {

	app.get('/scrape/daily', GameController.dailyScrape);

	app.get('/scrape/year/:fullYear', GameController.getYear)

}