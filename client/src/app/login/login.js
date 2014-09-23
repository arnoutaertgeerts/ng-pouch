(function() {
    'use strict';

    angular
        .module('login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        '$window',
        'Auth',
        'toaster'
    ];

    function LoginCtrl($rootScope, $scope, $location, $window, Auth, toaster) {
        var vm = this;

        vm.rememberme = true;
        vm.login = login;

        function login() {
            Auth.login(vm.name, vm.password).then(function (res) {
                $location.path('/home');
                toaster.pop('success', 'Login successful!', 'Welcome ' + vm.name);

            }).catch(function (err) {
                toaster.pop('error', 'Login failed', 'Incorrect username or password, please try again!');
                $location.path('/login');

            });
        }
    }

})();
