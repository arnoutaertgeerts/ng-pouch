angular.module('user', [
    'ui.router',
    'ui.bootstrap',
    'authorization',
    'validation'
])

    /*
     * Route
     * */
    .config(function config($stateProvider) {
        var access = routingConfig.accessLevels;

        $stateProvider.state('user', {
            url: '/user',
            views: {
                "main": {
                    controller: 'UserCtrl',
                    templateUrl: 'user/user.tpl.html'
                }
            },
            data: {
                pageTitle: 'My Profile',
                access: 'user'
            }
        });
    })

    /*
     * Controller
     * */
    .controller('UserCtrl', [
        '$scope',
        '$modal',
        'Auth',
        function ($scope, $modal, Auth) {

        }]);