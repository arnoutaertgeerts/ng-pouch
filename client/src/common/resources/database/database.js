(function(){
    'use strict';

    angular
        .module('database')
        .factory('database', database);

    database.$inject = [
        '$http',
        '$q',
        'PouchDB'
    ];

    function database($http, $q, PouchDB) {

        function factory(databaseName) {
            return new PouchDB(databaseName);
        }

        return factory;
    }

})();