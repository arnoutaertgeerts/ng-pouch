(function(){
    'use strict';

    angular
        .module('sofa')
        .factory('Database', Database);

    Database.$inject = [
        'PouchDB'
    ];

    function Database(PouchDB) {

        function factory(databaseName) {
            return new PouchDB(databaseName);
        }

        return factory;
    }

})();