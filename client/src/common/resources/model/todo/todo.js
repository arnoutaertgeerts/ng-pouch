(function() {
    'use strict';

    angular
        .module('model.todo')
        .factory('Todo', Todo);

    Todo.$inject = [
        '$q',
        'model'
    ];

    function Todo($q, model) {

        var Factory = model('todos', 'todo');

        Factory.example = example;

        return Factory;

        function example() {
            return new Factory({
                'title': 'A new todo',
                'description': 'This is the description of the new todo',
                'ok': false
            })
        }
    }

})();