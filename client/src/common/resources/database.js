angular.module('database', [
    'pouchdb'
])
    .factory('database', [
        '$http',
        '$q',
        'PouchDB',
        function ($http, $q, PouchDB) {
            var factory = {};

            factory.db = new PouchDB('https://housemt.couchappy.com/');

            factory.setType = function(type) {
                return {
                    type: type
                };
            };

            return factory;
        }]);