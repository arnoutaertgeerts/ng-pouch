(function() {
    'use strict';

    angular
        .module('user')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
        $stateProvider.state('user', {
            url: '/user',
            views: {
                "main": {
                    controller: 'UserCtrl',
                    controllerAs: 'vm',
                    templateUrl: 'user/user.tpl.html'
                }
            },
            data: {
                pageTitle: 'My Profile',
                access: 'user'
            }
        });
    }

})();