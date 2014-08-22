angular.module('login', [
    'ui.router',
    'authorization'
])

    .config(function config($stateProvider) {
        var access = routingConfig.accessLevels;

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
        function ($rootScope, $scope, $location, $window, Auth) {

            $scope.rememberme = true;
            $scope.login = function () {
                Auth.login($scope.username, $scope.password).then(function(res) {
                    $location.path('/home');
                }, function(err) {
                    $location.path('/login');
                });
            };
        }]);