angular.module('database', [
    'pouchdb'
])

    //Model database
    .factory('database', [
        '$http',
        '$q',
        'PouchDB',
        function ($http, $q, PouchDB) {
            var factory = {};

            factory.db = new PouchDB('https://housemt.couchappy.com/todos');
            return factory;
        }])

    //User database
    .factory('userdb', [
        '$http',
        '$q',
        'PouchDB',
        function ($http, $q, PouchDB) {
            var factory = {};

            factory.db = new PouchDB('https://housemt.couchappy.com/_users');
            return factory;
        }]);