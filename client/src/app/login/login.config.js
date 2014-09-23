(function() {
    'use strict';

    angular
        .module('login')
        .config(loginConfig);

    loginConfig.$inject = ['$stateProvider'];

    function loginConfig($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            views: {
                "main": {
                    controller: 'LoginCtrl',
                    controllerAs: 'vm',
                    templateUrl: 'login/login.tpl.html'
                }
            },
            data: {
                pageTitle: 'Login',
                access: 'anon'
            }
        });
    }


})();
