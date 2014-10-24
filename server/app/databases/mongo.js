//Connect to MongoDB
var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:secret@ds035750.mongolab.com:35750/pouch-users');
var mongo = mongoose.connection;