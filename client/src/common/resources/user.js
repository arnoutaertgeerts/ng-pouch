angular.module('model.user', [
    'model'
])
    .factory('User', [
        '$q',
        '$http',
        function($q, $http) {

            var User = function (data) {
                angular.extend(this, data);
            };

            User.prototype.$save = function() {
                var model = this;

                return $http.post('/update', model).then(function(res) {
                    model._rev = res.rev;
                })
            };

            return User;

        }]);
