(function() {
    'use strict';

    angular
        .module('model.user')
        .factory('User', User);

    User.$inject = [
        '$q',
        '$http'
    ];

    function User($q, $http) {
        var User = InitUser;

        User.prototype.$save = save;

        return User;

        function InitUser(data) {
            angular.extend(this, data);
        }

        function save() {
            var model = this;

            return $http.post('/update', model).then(function(res) {
                model._rev = res.rev;
            })
        }
    }

})();
