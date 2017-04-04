'use strict'

var express = require('express');
var mongoose = require('mongoose');
var app     = express();

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL);

app.use((req, res, next) => {
	console.log(new Date(), req.method, req.url);
	next();
});

require('./api/routes/TeamRoutes')(app);
require('./api/routes/GameRoutes')(app);

app.listen('8082');
console.log('Magic happens on port 8082');
exports = module.exports = app;