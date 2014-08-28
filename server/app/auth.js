var passport = require('passport');

module.exports = {

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
