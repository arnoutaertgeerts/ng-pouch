(function () {
    'use strict';

    angular
        .module('authorization')
        .factory('Auth', Auth);

    Auth.$inject = [
        '$http',
        '$cookieStore',
        'database',
        'Access',
        'User',
        'toaster'
    ];

    function Auth($http, $cookieStore, database, Access, User, toaster) {

        var db = database("https://housemt.couchappy.com/todos");
        var currentUser = new User($cookieStore.get('user') || { name: '', roles: ['anon']});

        $cookieStore.remove('user');

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        var factory = {
            authorize: authorize,
            getUser: getUser,
            isLoggedIn: isLoggedIn,
            register: register,
            checkMail: checkMail,
            login: login,
            logout: logout,
            changePassword: changePassword,
            user: currentUser
        };

        return factory;

        function authorize(accessLevel, roles) {
            if (roles === undefined) {
                roles = currentUser.roles;
            }

            var authorizedRoles = Access[accessLevel];

            return _.intersection(authorizedRoles, currentUser.roles).length > 0;

        }

        function getUser(name) {
            db.getUser(name).then(function (res) {
                changeUser(new User(res));
            });
        }

        function isLoggedIn(user) {
            if (user === undefined) {
                user = currentUser;
            }

            return user.roles.indexOf("anon") === -1;
        }

        function register(user) {
            user["type"] = "user";

            //Roles are set and overwritten server side to keep the app safe.
            user["roles"] = "";

            return $http.post('/signup', user).then(function (res) {
                toaster.pop('success', 'Your account was created! Try logging in :)')
            })
        }

        function checkMail(email) {
            $http.post('/checkmail', {
                email: email
            }).then(function (res) {
                return res;
            }).catch(function (err) {
                return err;
            })
        }

        function login(name, password) {
            return db.login(name, password).then(function (res) {
                factory.getUser(name);
            });
        }

        function logout(success, error) {
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
        }

        function changePassword(oldPassword, newPassword) {
            //Check the old password of the current user by logging in again
            var name = currentUser.name;

            //Change the password to the new password
            factory.login(name, oldPassword).then(function () {
                currentUser.password = newPassword;
                currentUser.$save().then(function () {
                    factory.getUser(name);
                });
            }).catch(function (err) {
                console.log(err);
            });
        }

        function update() {
            return factory.getUser(factory.user.name);
        }
    }

})();