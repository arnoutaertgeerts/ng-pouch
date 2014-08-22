angular.module('model.todo', [
    'model'
])
    .factory('Todo', [
        '$q',
        'model',
        function($q, model) {

            var Factory = model('todo');

            //Default values for the todo model
            Factory.example = function() {
                return new Factory({
                    'title': 'A new todo',
                    'description': 'This is the description of the new todo',
                    'ok': false
                });
            };

            return Factory;

        }]);