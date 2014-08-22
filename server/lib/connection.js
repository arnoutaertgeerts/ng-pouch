/*
 * Set up the connection to the database which is stored on mongolab.com
 * */


var config = require('./config.js');

var mongoose = require('mongoose');
mongoose.set('debug', true);

mongoose.connect(config.mongo.connectionURL);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'.red));
db.once('open', function callback() {
    console.log('Connected to the database');
});
