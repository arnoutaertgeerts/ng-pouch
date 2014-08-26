angular.module('model.user', [
    'model',
    'database'
])
    .factory('User', [
        '$q',
        'model',
        'userdb',
        function($q, model) {

            var Factory = model('user');

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
