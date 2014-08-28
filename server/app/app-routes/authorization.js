var cradle = require('cradle');
var q = require('Q');

var connection = new (cradle.Connection)('https://housemt.couchappy.com', 443, {
    secure: true,
    auth: { username: 'admin', password: 'secret' }
});

var db = connection.database('_users');

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
        var user = request.body;

        var save = function () {
            db.save('org.couchdb.user:' + user.name, user, function (err, res) {
                if (err) {
                    respons.json(err.status, err);
                } else {
                    respons.json(200, 'User created/updated');
                }
            });
        };

        // Do the unique checks
        return q.all([
            checkName(user.name, 0),
            checkMail(user.email, 0)
        ])
            .then(function () {
                save();
            })
            .catch(function (err) {
                respons.json(409, err)
            })
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

        // Do the unique checks
        return q.all([
            checkName(user.name, 1),
            checkMail(user.email, 0)
        ])
            .then(function () {
                save();
            })
            .catch(function (err) {
                respons.json(409, err)
            })
    })
};


var checkMail = function (email, duplicates) {
    var deferred = q.defer();

    console.log(email);

    db.view('unique/email', {
        key: email
    }, function (err, doc) {

        if (doc.rows.length > duplicates) {
            if (doc.rows[0].value > duplicates) {
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

var checkName = function (name, duplicates) {
    var deferred = q.defer();

    db.view('unique/name', {
        key: 'org.couchdb.user:' + name
    }, function (err, doc) {

        if (doc.rows.length > duplicates) {
            if (doc.rows[0].value > duplicates) {
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
