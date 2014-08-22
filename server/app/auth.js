var passport = require('passport'),
    mongoose = require('mongoose'),
    userRoles = require('../../client/src/app/routingConfig').userRoles,
    accessLevels = require('../../client/src/app/routingConfig').accessLevels,
    User = require('./users/user-models.js');

module.exports = {

    /*
     * Authorization access routes
     * */
    loginRequired: function (req, res, next) {
        var role;
        if (!req.user) {
            role = userRoles.public;
        }
        else  {
            role = req.user.role;
        }

        var accessLevel = accessLevels.user;

        if (!(accessLevel.bitMask & role.bitMask)) {
            return res.send(403);
        }

        return next();
    },

    adminRequired: function (req, res, next) {
        var role;
        if (!req.user) {
            role = userRoles.public;
        }
        else {
            role = req.user.role;
        }

        var accessLevel = accessLevels.admin;

        if (!(accessLevel.bitMask & role.bitMask)) {
            return res.send(403);
        }

        return next();
    },

    userOrAdmin: function (req, res, next) {
        var role;
        var accessLevel = accessLevels.admin;
        if (!req.user) {
            role = userRoles.public;
        }
        else {
            role = req.user.role;
        }

        if (req.params.id === req.user.id) {
            return next();
        }

        if (!(accessLevel.bitMask & role.bitMask)) {
            return res.send(403);
        }

        return next();
    },

    /*
     * User authorization routes
     * */
    addUser: function (req, res) {
        var username = req.body.username,
            email = req.body.email,
            password = req.body.password,
            verification = req.body.verification,
            role = req.body.role;

        User.addUser(username, email, role, 'none', 0, password, verification).then(function (user) {
            req.logIn(user, function (err) {
                if (err) {
                    next(err);
                }
                else {
                    res.json(200, user)
                }
            });
        }).catch(function (err) {
            res.json(403, err);
        })
    },

    login: function (req, res, next) {
        return passport.authenticate('local', function (err, user, reason) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json(400, reason.message);
            }

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }

                if (req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                return res.json(200, user);
            });
        })(req, res, next);
    },

    logout: function (req, res) {
        req.logout();
        res.send(200);
    }

};
