(function() {
    'use strict';

    angular
        .module('admin')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
        $stateProvider.state('admin', {
            url: '/admin',
            views: {
                "main": {
                    controller: 'AdminCtrl',
                    controllerAs: 'vm',
                    templateUrl: 'admin/admin.tpl.html'
                }
            },
            data: {
                pageTitle: 'Admin',
                access: 'user'
            }
        });
    }

})();