(function() {
    'use strict';

    angular
        .module('register')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
        $stateProvider.state('register', {
            url: '/register',
            views: {
                "main": {
                    controller: 'RegisterCtrl',
                    controllerAs: 'vm',
                    templateUrl: 'register/register.tpl.html'
                }
            },
            data: {
                pageTitle: 'Register',
                access: 'anon'
            }
        });
    }

})();
