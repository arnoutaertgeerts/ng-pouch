//Dependencies
var _ = require('underscore'),
    colors = require('colors'),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    userRoles = require('../../../client/src/app/routingConfig').userRoles,
    validator = require('validator'),
    utility = require('../../lib/utility.js'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    LinkedInStrategy = require('passport-linkedin').Strategy,
    Q = require('q');

Schema = mongoose.Schema;

//User Schema
var UserSchema = new Schema({
    email: {type: String, default: 'change@mail.com'},
    username: {
        type: String,
        unique: true,
        default: 'Nikola'
    },

    //Verified by email
    verified: {
        type: Boolean,
        default: false},

    //Role
    role: {
        bitMask: {
            type: Number
        },
        title: {
            type: String
        }
    },

    //Authorization
    hashed_password: String,
    createdAt: Date,
    salt: String,

    //Provider strategy
    provider: String,
    providerId: String
});

//Virtuals
UserSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

/**
 * Instance methods for a document of a Model
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function (password) {
        if (!password) return '';
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    }
};

var User = mongoose.model('User', UserSchema);

/**
 * Static methods for the Model collection
 */
module.exports = {
    standard: function () {
        var user = new User({
            password: 'default'
        });
        user.save();
        return user
    },

    validate: function (username, email, role, currentUser) {
        var deferred = Q.defer();

        var check = true;
        var msg = null;

        if (!validator.isLength(username, 1, 20)) {
            check = false;
            msg = 'Username must be between 1-20 characters long'
        }
        if (!validator.isEmail(email)) {
            check = false;
            msg = 'Invalid email address'
        }
        if (!validator.isAlphanumeric(username)) {
            check = false;
            msg = 'Username can only contain letters and numbers'
        }

        var stringArr = _.map(_.values(userRoles), function (val) {
            return val.toString()
        });
        if (!validator.isIn(role, stringArr)) {
            check = false;
            msg = 'Invalid role type'
        }

        utility.checkUnique(email, User, 'email')
            .then(function (unique) {
                if (!unique) {
                    if (currentUser) {
                        if (email != currentUser.email) {
                            check = false;
                            msg = 'Email already taken';
                        }
                    }
                    else {
                        check = false;
                        msg = 'Email already taken';
                    }
                }
                // Return second promise
                return utility.checkUnique(username, User, 'username')
            }).then(function (unique) {
                if (!unique) {
                    if (currentUser) {
                        if (username != currentUser.username) {
                            check = false;
                            msg = 'Username already taken';
                        }
                    }
                    else {
                        check = false;
                        msg = 'Username already taken';
                    }
                }

                if (!check) {
                    deferred.reject(msg)
                } else {
                    deferred.resolve()
                }
            });

        return deferred.promise;
    },

    addUser: function (username, email, role, provider, providerId, password, verification) {
        var deferred = Q.defer();
        var user = null;

        if (password === null) {
            user = new User({
                email: email,
                username: username,
                role: role,
                provider: provider,
                providerId: providerId
            });
            return user.save();

        } else {
            this.validate(username, email, role).then(function () {

                if (password != verification) {
                    deferred.reject('Passwords do not match')
                }
                if (!validator.isLength(password, 5, 60)) {
                    deferred.reject('Password must be between 5-20 characters long')
                }

                user = new User({
                    email: email,
                    username: username,
                    role: role,
                    password: password
                });

                user.save(function (err, newUser) {
                    if (err) {
                        deferred.reject(err)
                    }
                    else {
                        deferred.resolve(newUser)
                    }
                })
            }).catch(function (err) {
                deferred.reject(err);
            })
        }

        return deferred.promise;
    },

    findByName: function (username) {
        return User.find({'username': username}).exec();
    },

    findById: function (id) {
        var deferred = Q.defer();
        User.findById(id, function (err, doc) {
            if (err) {
                deferred.reject(err)
            }
            else {
                deferred.resolve(doc)
            }
        });

        return deferred.promise;
    },

    remove: function (id) {
        var deferred = Q.defer();

        this.findById(id).then(function (user) {
            user.remove(function (err) {
                if (err) {
                    deferred.reject(err)
                } else {
                    deferred.resolve('Successfully deleted.')
                }
            })
        });

        return deferred.promise;
    },

    query: function (query) {
        return User.find(query).lean().exec();
    },

    findByProviderId: function (provider, id) {
        return User.find({'provider': provider}).where('providerId').equals(id).exec();
    },

    findOrCreateOauthUser: function (provider, profile) {
        var res = this.findByProviderId(provider, profile.id);
        res.then(function (user) {
            return user;
        }, function (err) {
            this.addUser(profile.displayName, profile.email, userRoles.public, provider, profile.id, null).then(function (user) {
                return user
            })
        });
    },

    localStrategy: new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function (username, password, done) {
            console.log('Hello!');
            User.findOne({
                username: username
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, user);
            });
        }
    ),

    twitterStrategy: function () {
        if (!process.env.TWITTER_CONSUMER_KEY)    throw new Error('A Twitter Consumer Key is required if you want to enable login via Twitter.');
        if (!process.env.TWITTER_CONSUMER_SECRET) throw new Error('A Twitter Consumer Secret is required if you want to enable login via Twitter.');

        return new TwitterStrategy({
                consumerKey: process.env.TWITTER_CONSUMER_KEY,
                consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
                callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:8000/auth/twitter/callback'
            },
            function (token, tokenSecret, profile, done) {
                var user = this.findOrCreateOauthUser(profile.provider, profile);
                done(null, user);
            });
    },

    facebookStrategy: function () {
        if (!process.env.FACEBOOK_APP_ID)     throw new Error('A Facebook App ID is required if you want to enable login via Facebook.');
        if (!process.env.FACEBOOK_APP_SECRET) throw new Error('A Facebook App Secret is required if you want to enable login via Facebook.');

        return new FacebookStrategy({
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:8000/auth/facebook/callback"
            },
            function (accessToken, refreshToken, profile, done) {
                var user = this.findOrCreateOauthUser(profile.provider, profile);
                done(null, user);
            });
    },

    googleStrategy: function () {
        return new GoogleStrategy({
                returnURL: process.env.GOOGLE_RETURN_URL || "http://localhost:8000/auth/google/return",
                realm: process.env.GOOGLE_REALM || "http://localhost:8000/"
            },
            function (identifier, profile, done) {
                var user = this.findOrCreateOauthUser('google', profile);
                done(null, user);
            });
    },

    linkedInStrategy: function () {
        if (!process.env.LINKED_IN_KEY)    throw new Error('A LinkedIn App Key is required if you want to enable login via LinkedIn.');
        if (!process.env.LINKED_IN_SECRET) throw new Error('A LinkedIn App Secret is required if you want to enable login via LinkedIn.');

        return new LinkedInStrategy({
                consumerKey: process.env.LINKED_IN_KEY,
                consumerSecret: process.env.LINKED_IN_SECRET,
                callbackURL: process.env.LINKED_IN_CALLBACK_URL || "http://localhost:8000/auth/linkedin/callback"
            },
            function (token, tokenSecret, profile, done) {
                var user = this.findOrCreateOauthUser('linkedin', profile);
                done(null, user);
            }
        );
    },

    serializeUser: function (user, done) {
        done(null, user.id);
    },

    deserializeUser: function (id, done) {
        User.findOne({
            _id: id
        }, '-salt -hashed_password', function (err, user) {
            done(err, user);
        });
    },

    model: function () {
        return User;
    }
};