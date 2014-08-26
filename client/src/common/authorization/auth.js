angular.module('authorization', [
    'ngCookies',
    'database',
    'model.user'
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
    .factory('Auth', function ($http, $cookieStore, database, Access, User) {

        var db = database.db,
            currentUser = new User($cookieStore.get('user') || { username: '', role: 'anon' });

        $cookieStore.remove('user');

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        var factory = {
            authorize: function (accessLevel, role) {
                if (role === undefined) {
                    role = currentUser.role;
                }

                var authorizedRoles = Access[accessLevel];
                return authorizedRoles.indexOf(role) != -1;
            },

            getUser: function (username) {
                db.getUser(username).then(function (res) {
                    changeUser(new User(res));
                });
            },

            isLoggedIn: function (user) {
                if (user === undefined) {
                    user = currentUser;
                }
                return user.role === 'user' || user.role === 'admin';
            },

            register: function (user) {
                return db.signup(user.username, user.password, {
                    metadata: {
                        email: user.email,
                        role: user.role
                    }
                });
            },

            login: function (username, password) {
                return db.login(username, password).then(function (res) {
                    factory.getUser(username);
                });
            },

            logout: function (success, error) {
                db.logout(currentUser.username).then(function () {
                    changeUser({
                        username: '',
                        email: '',
                        role: 'anon'
                    });
                    success();
                }, function () {
                    error();
                });
            },

            changePassword: function(oldPassword, newPassword) {
                //Check the old password of the current user by logging in again
                var username = currentUser.name;

                //Change the password to the new password
                factory.login(username, oldPassword).then(function() {
                    currentUser.password = newPassword;
                    currentUser.$save().then(function() {
                        factory.getUser(username);
                    });
                }).catch(function(err) {
                    console.log(err);
                });
            },

            update: function () {
                return factory.getUser(factory.user.username);
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
                        if (user.role) {
                            userRole = user.role;
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