angular.module('authorization', [
    'ngCookies',
    'database',
    'model.user',
    'toaster'
])

    /*
     *
     * Access levels
     * */
    .factory('Access', function () {
        var factory = {};

        //Only accessible to non-logged in users
        factory.anon = [
            'anon'
        ];

        //Accessible to everyone
        factory.public = [
            'anon',
            'user',
            'admin'
        ];

        //Only accessible to users and admins
        factory.user = [
            'user',
            'admin'
        ];

        //Only accessible to admins
        factory.admin = [
            'admin'
        ];

        return factory;
    })

    /*
     *
     * Authorization service
     * */
    .factory('Auth', function ($http, $cookieStore, database, Access, User, toaster) {

        var db = database.db,
            currentUser = new User($cookieStore.get('user') || { name: '', roles: ['anon']});

        $cookieStore.remove('user');

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        var factory = {
            authorize: function (accessLevel, roles) {
                if (roles === undefined) {
                    roles = currentUser.roles;
                }

                var authorizedRoles = Access[accessLevel];

                return _.intersection(authorizedRoles, currentUser.roles).length > 0;

            },

            getUser: function (name) {
                db.getUser(name).then(function (res) {
                    changeUser(new User(res));
                });
            },

            isLoggedIn: function (user) {
                if (user === undefined) {
                    user = currentUser;
                }

                return user.roles.indexOf('anon') != -1;
            },

            register: function (user) {
                user["type"] = "user";
                user["roles"] = [];

                return $http.post('/signup', user).then(function(res) {
                    toaster.pop('success', 'Your account was created! Try logging in :)')
                })
            },

            checkMail: function(email) {
                $http.post('/checkmail', {
                    email: email
                }).then(function(res) {
                    return res;
                }).catch(function(err) {
                    return err;
                })
            },

            login: function (name, password) {
                return db.login(name, password).then(function (res) {
                    factory.getUser(name);
                });
            },

            logout: function (success, error) {
                db.logout(currentUser.name).then(function () {
                    changeUser({
                        name: '',
                        email: '',
                        roles: ['anon']
                    });
                    success();
                }, function () {
                    error();
                });
            },

            changePassword: function(oldPassword, newPassword) {
                //Check the old password of the current user by logging in again
                var name = currentUser.name;

                //Change the password to the new password
                factory.login(name, oldPassword).then(function() {
                    currentUser.password = newPassword;
                    currentUser.$save().then(function() {
                        factory.getUser(name);
                    });
                }).catch(function(err) {
                    console.log(err);
                });
            },

            update: function () {
                return factory.getUser(factory.user.name);
            },

            user: currentUser
        };

        return factory;
    })


    /*
     *
     * Authorization directive
     * */
    .directive('accessLevel', [
        'Auth',
        'Access',
        function (Auth) {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    var prevDisp = element.css('display'),
                        userRole,
                        accessLevel;

                    $scope.user = Auth.user;
                    $scope.$watch('user', function (user) {
                        if (user.roles) {
                            userRole = user.roles;
                        }
                        updateCSS();
                    }, true);

                    attrs.$observe('accessLevel', function (al) {
                        if (al) {
                            accessLevel = al;
                        }
                        updateCSS();
                    });

                    function updateCSS() {
                        if (userRole && accessLevel) {
                            if (!Auth.authorize(accessLevel, userRole)) {
                                element.css('display', 'none');
                            }
                            else {
                                element.css('display', prevDisp);
                            }
                        }
                    }
                }
            };
        }]);