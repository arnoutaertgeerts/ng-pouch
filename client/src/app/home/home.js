angular.module('home', [
    'ui.router'
])

    .config(function config($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            views: {
                "main": {
                    controller: 'HomeCtrl',
                    templateUrl: 'home/home.tpl.html'
                }
            },
            data: {
                pageTitle: 'Home',
                access: 'public'
            }
        });
    })

    .controller('HomeCtrl', function HomeController($scope, PouchDB) {

    });