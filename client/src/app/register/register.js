(function() {
    'use strict';

    angular
        .module('register')
        .controller('RegisterCtrl', RegisterCtrl);

    RegisterCtrl.$inject = ['$rootScope', '$scope', '$location', 'Auth', 'toaster'];

    function RegisterCtrl($rootScope, $scope, $location, Auth, toaster) {
        var vm = this;
        var role = 'user';

        vm.submit = submit;


        function submit(data) {
            Auth.register({
                name: data.name,
                email: data.email,
                password: data.password
            }).then(
                function () {
                    $location.path('/');
                },
                function (err) {
                    if(err.status === 409) {
                        toaster.pop('error', err.data);
                    }
                    else {
                        console.log(err);
                        toaster.pop('error', 'Something went wrong during the signup...', err.message);
                    }

                    $location.path('/register');
                });
        }
    }

})();

