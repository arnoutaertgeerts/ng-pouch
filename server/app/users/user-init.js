require('./user-models');
var mongoose = require('mongoose');
var config = require('./../../lib/config.js');

mongoose.connect(config.mongo.connectionURL);
var db = mongoose.connection;

var User = mongoose.model('User');

var admin = new User({
    username: 'Admin',
    email: 'arnoutaertgeerts@gmail.com',
    password: 'Cynalco',
    admin: true,
    verified: true,
    createdAt: Date.now()
});

console.log('**Configuration file');

admin.save(function(err) {
    console.log(err);
    console.log('Added admin')
});