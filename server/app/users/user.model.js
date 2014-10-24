require('./../databases/mongo.js');
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    _id: {type: String, unique: true},
    name: {type: String, unique: true},
    email: {type: String, unique: true}
});

module.exports =  mongoose.model('User', UserSchema);
