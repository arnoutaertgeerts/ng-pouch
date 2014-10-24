var User = require('./user.model.js');
var Q = require('q');
var couch = require('./../databases/couch.js');
var cookie = require('cookie');

var couchAdmin = couch.admin;
var couchUser = couch.user;
var couchAnon = couch.anon;

var controller = {
    login: login,
    signup: signup,
    update: update,
    checkIfMailUnique: checkIfMailUnique,
    checkIfNameUnique: checkIfNameUnique
};

module.exports = controller;

function login(name, password) {
    var deferred = Q.defer();

    couchAdmin.auth(name, password, function(err, body, headers) {
        if(err) {
            deferred.reject(err)
        }

        var authCookie = cookie.parse(headers['set-cookie'][0]);
        deferred.resolve(authCookie);
    });

    return deferred.promise
}

function signup(user) {
    user.roles = ["user"];

    //Check if uniques exist with MongoDB
    return checkSave(user).then(save);

}

function update(user, cookie) {
    return checkUpdate(user).then(function() {
        updateCouch(user, cookie)
    })
}

function checkIfMailUnique(email) {
    var deferred = Q.defer();

    User.find({email: email}, function(err, docs) {
        if(err) {
            deferred.reject(err);
        }
        if(docs.length > 0) {
            deferred.reject('Email already taken')
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;

}

function checkIfNameUnique(name) {
    var deferred = Q.defer();

    User.find({name: name}, function(err, docs) {
        if(err) {
            deferred.reject(err);
        }
        if(docs.length > 0) {
            deferred.reject('Name already taken')
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;

}

//Save a user in couchDB
function save (user) {
    var deferred = Q.defer();

    couchAdmin.insert(user, function (err, res) {
        if (err) {
            User.findByIdAndRemove(user._id);
            deferred.reject(err);
        } else {
            deferred.resolve(user);
        }
    });

    return deferred.promise;
}

//Update a user in couchDB
function updateCouch (user, cookie) {
    var deferred = Q.defer();

    couchUser(cookie).insert(user, function (err, res) {
        if (err) {
            User.findByIdAndRemove(user._id);
            deferred.reject(err);
        } else {
            deferred.resolve(user);
        }
    });

    return deferred.promise;
}

//Check if it is possible to save a new User
function checkSave(user) {
    var deferred = Q.defer();

    var mongoUser = new User(user);
    mongoUser.save(function(err, res) {
        if(err) {
            deferred.reject(err)
        } else {
            deferred.resolve(user)
        }
    });

    return deferred.promise;
}

//Check if it is possible to update an existing user
function checkUpdate(user) {
    var deferred = Q.defer();

    var mongoUser = new User(user);
    mongoUser.update(function(err) {
       if(err) {
           deferred.reject(err)
       } else {
           deferred.resolve(user)
       }
    });

    return deferred.promise;
}