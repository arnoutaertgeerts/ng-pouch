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

            return Factory;

        }]);
