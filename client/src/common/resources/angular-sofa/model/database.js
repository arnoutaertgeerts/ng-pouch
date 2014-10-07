(function(){
    'use strict';

    angular
        .module('sofa')
        .factory('Database', Database);

    Database.$inject = [
        '$http',
        '$q',
        'PouchDB'
    ];

    function Database($http, $q, PouchDB) {

        function factory(databaseName) {
            return new PouchDB(databaseName);
        }

        return factory;
    }

})();