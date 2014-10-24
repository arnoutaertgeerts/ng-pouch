(function() {
    'use strict';

    angular
        .module('model.user')
        .factory('User', User);

    User.$inject = [
        '$http',
        'Auth'
    ];

    function User($http, Auth) {
        var User = InitUser;

        User.prototype.$save = save;

        return User;

        function InitUser(data) {
            angular.extend(this, data);
        }

        function save() {
            var model = this;

            return Auth.getCookie().then(function(authCookie) {

                $http.post('/update', model).then(function(res) {
                    model._rev = res.rev;
                })
            });
        }
    }

})();
