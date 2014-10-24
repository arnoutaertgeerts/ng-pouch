var q = require('Q');
var mongoose = require('mongoose');

//Couchdb Connection
var db = require('nano')('https://admin:secret@housemt.iriscouch.com:6984/_users');
db.get('test', function(err, res) {
    if(err.error !== 'not_found') {
        console.log('Something went wrong connecting to CouchDB... :(');
        console.log(err);
    }
});

//MongoDB connections
mongoose.connect('mongodb://admin:secret@ds035750.mongolab.com:35750/pouch-users');
var mongo = mongoose.connection;

var UserSchema = mongoose.Schema({
    _id: {type: String, unique: true},
    name: {type: String, unique: true},
    email: {type: String, unique: true}
});

var User = mongoose.model('User', UserSchema);


//Module routes
module.exports = function (app) {
    app.post('/checkmail', function (request, respons, next) {
        checkMail(request.body.email).then(function (res) {
            respons.json(200, res)
        }).catch(function (err) {
            respons.json(409, err)
        });
    });

    app.post('/checkname', function (request, respons, next) {
        checkName(request.body.name).then(function (res) {
            respons.json(200, res)
        }).catch(function (err) {
            respons.json(409, err)
        });
    });

    app.post('/signup', function (request, respons, next) {
        //Hard code role of a new user to user
        var user = request.body;
        user.roles = ["user"];

        //Check if uniques exist with MongoDB
        var mongoUser = new User(user);
        mongoUser.save(function(err) {
            if(err) {
                respons.json(409, 'There is a duplicate in the database');
                console.log(err)
            } else {
                console.log('No duplicates');
                save()
            }
        });

        var save = function () {
            db.insert(user, function (err, res) {
                if (err) {
                    User.findByIdAndRemove(user._id);
                    respons.json(err.status_code, err.reason);
                } else {
                    respons.json(200, 'User created/updated');
                }
            });
        };
    });

    app.post('/update', function(request, respons, next) {
        var user = request.body;

        var save = function () {
            db.save('org.couchdb.user:' + user.name, user, function (err, res) {
                if (err) {
                    respons.json(400, err);
                } else {
                    respons.json(200, 'User created/updated');
                }
            });
        };

        //Get the user as he exists in the database now
        db.get(user._id, function(oldUser) {
            return q.all([
                checkName(user.name, user.name === oldUser.name),
                checkMail(user.email, user.email === oldUser.email)
            ])
                .then(function () {
                    save();
                })
                .catch(function (err) {
                    respons.json(409, err)
                })
        });
    })
};


var checkMail = function (email, changed) {
    var deferred = q.defer();

    console.log(email);

    if (!changed) {
        deferred.resolve('Email address is not changed')
    }

    db.view('unique/email', {
        key: email
    }, function (err, doc) {

        if (doc.rows.length > 0) {
            if (doc.rows[0].value > 0) {
                console.log('mail error');
                deferred.reject('Email address already taken');
            } else {
                deferred.resolve('Email address available');
            }
        } else {
            deferred.resolve('Email address available');
        }
    });

    return deferred.promise;
};

var checkName = function (name, changed) {
    var deferred = q.defer();

    if (!changed) {
        deferred.resolve('Username is not changed')
    }

    db.view('unique/name', {
        key: 'org.couchdb.user:' + name
    }, function (err, doc) {

        if (doc.rows.length > 0) {
            if (doc.rows[0].value > 0) {
                deferred.reject('Username already taken')
            } else {
                deferred.resolve('Username available')
            }
        } else {
            deferred.resolve('Username available');
        }
    });

    return deferred.promise;
};
