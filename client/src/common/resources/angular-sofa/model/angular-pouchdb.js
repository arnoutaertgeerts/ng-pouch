(function() {
    'use strict';

    angular
        .module('sofa')
        .factory('PouchDB', PouchDBFactory);

    PouchDBFactory.$inject = [
        '$timeout',
        '$window',
        '$rootScope',
        '$q'
    ];
    
    function PouchDBFactory($timeout, $window, $rootScope, $q) {
        return function(name, options) {
            var db = new $window.PouchDB(name, options);

            var factory = {
                post: post,
                put: put,
                remove: remove,
                query: query,
                getUser: getUser,
                getSession: getSession,
                signup: signup,
                login: login,
                logout: logout
            };

            return factory;

            //Events
            function startRequest() {
                $rootScope.$emit('req:start');
            }

            function endRequest() {
                $rootScope.$emit('req:end');
            }

            function error(err) {
                var deferred = $q.defer();
                
                if (err.status >= 400 && err.status < 500) {
                    $rootScope.$emit('req:unauthorized', err.message);
                    deferred.reject(err);
                } else {
                    $rootScope.$emit('req:error', err.message);
                    deferred.reject(err);
                }
                
                return deferred.promise;
            }

            //Wrapper methods
            function post(model) {
                startRequest();

                return $timeout(function() {
                    return db.post(model);
                }).catch(error).finally(endRequest)
            }

            function put(model) {
                startRequest();

                return $timeout(function() {
                    return db.put(model)
                }).catch(error).finally(endRequest)
            }

            function remove(model) {
                startRequest();

                return $timeout(function() {
                    return db.remove(model)
                }).catch(error).finally(endRequest)
            }

            function query(fun, options) {
                startRequest();

                return $timeout(function() {
                    return db.query(fun, options)
                }).catch(error).finally(endRequest)
            }

            function getUser(name) {
                startRequest();

                return $timeout(function() {
                    return db.getUser(name)
                }).catch(error).finally(endRequest)
            }

            function getSession() {
                startRequest();

                return $timeout(function() {
                    return db.getSession()
                }).catch(error).finally(endRequest)
            }

            function signup(name, password) {
                startRequest();

                return $timeout(function() {
                    return db.signup(name, password)
                }).catch(error).finally(endRequest)

            }

            function login(name, pass) {
                startRequest();

                return $timeout(function() {
                    return db.login(name, pass)
                }).catch(error).finally(endRequest)
            }

            function logout(name) {
                startRequest();

                return $timeout(function() {
                    return db.logout(name)
                }).catch(error).finally(endRequest)
            }
        }
    }
})();
