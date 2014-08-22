angular.module('register', [
    'ui.router',
    'authorization',
    'formFor'
])

    .config(function config($stateProvider) {
        var access = routingConfig.accessLevels;

        $stateProvider.state('register', {
            url: '/register',
            views: {
                "main": {
                    controller: 'RegisterCtrl',
                    templateUrl: 'register/register.tpl.html'
                }
            },
            data: {
                pageTitle: 'Register',
                access: 'anon'
            }
        });
    })

    .controller('RegisterCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        'Auth',
        function ($rootScope, $scope, $location, Auth) {
            var role = 'user';

            $scope.submit = function (data) {
                Auth.register({
                    username: data.email,
                    email: data.email,
                    password: data.password,
                    role: role
                }).then(
                    function () {
                        $location.path('/');
                    },
                    function (err) {
                        $location.path('/register');
                    });
            };
        }])

    .service('UserSignUp', function () {
        this.validationRules = {
            email: {
                required: true,
                pattern: /^\w+@\w+\.\w+$/ // Simple email format
            },
            password: {
                required: true,
                minlength: 5
            }
        };

        return this;
    });
