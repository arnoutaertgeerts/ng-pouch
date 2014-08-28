angular.module('login', [
    'ui.router',
    'authorization',
    'toaster'
])

    .config(function config($stateProvider) {

        $stateProvider.state('login', {
            url: '/login',
            views: {
                "main": {
                    controller: 'LoginCtrl',
                    templateUrl: 'login/login.tpl.html'
                }
            },
            data: {
                pageTitle: 'Login',
                access: 'anon'
            }
        });
    })

    .controller('LoginCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$window',
        'Auth',
        'toaster',
        function ($rootScope, $scope, $location, $window, Auth, toaster) {

            $scope.rememberme = true;
            $scope.login = function () {
                Auth.login($scope.name, $scope.password).then(function(res) {
                    $location.path('/home');
                    toaster.pop('success', 'Login successful!', 'Welcome ' + $scope.name);

                }).catch(function (err) {
                    toaster.pop('error', 'Login failed', 'Incorrect username or password, please try again!');
                    $location.path('/login');

                });
            };
        }]);