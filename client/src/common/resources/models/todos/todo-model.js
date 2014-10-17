(function() {
    'use strict';

    angular
        .module('todos')
        .factory('TodoModel', TodoModel);

    TodoModel.$inject = [
        'Model'
    ];

    function TodoModel(Model) {
        return Model('https://housemt.iriscouch.com/testdb', 'post');
    }

})();