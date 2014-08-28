angular.module('register', [
    'ui.router',
    'authorization',
    'formFor',
    'toaster'
])

    .config(function config($stateProvider) {

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
        'toaster',
        function ($rootScope, $scope, $location, Auth, toaster) {
            var role = 'user';

            $scope.submit = function (data) {
                Auth.register({
                    _id: data.email,
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: role
                }).then(
                    function () {
                        $location.path('/');
                    },
                    function (err) {
                        if(err.status === 409) {
                            toaster.pop('error', err.data);
                        }
                        else {
                            toaster.pop('error', 'Something went wrong during the signup...', err.message);
                        }

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
