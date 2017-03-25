'use strict'

var express = require('express');
var mongoose = require('mongoose');
var app     = express();

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL);

require('./api/routes/TeamRoutes')(app);
require('./api/routes/GameRoutes')(app);

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;