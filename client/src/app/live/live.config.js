(function() {
    'use strict';

    angular
        .module('live')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
        $stateProvider.state('live', {
            url: '/live',
            views: {
                "main": {
                    controller: 'LiveCtrl',
                    controllerAs: 'vm',
                    templateUrl: 'live/live.tpl.html'
                }
            },
            data: {
                pageTitle: 'Live',
                access: 'public'
            }
        });
    }

})();