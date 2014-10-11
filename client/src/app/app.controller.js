(function() {
    'use strict';


    angular
        .module('app')
        .controller('AppCtrl', AppCtrl);


    AppCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        'Auth',
        'cfpLoadingBar'
    ];


    function AppCtrl($rootScope, $scope, $location, Auth, cfpLoadingBar) {
        var vm = this;

        vm.logout = logout;
        vm.clearError = clearError;

        //Catch request start end stop events for the loading bar
        $rootScope.$on('req:start', cfpLoadingBar.start);
        $rootScope.$on('req:end', cfpLoadingBar.complete);

        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                vm.pageTitle = toState.data.pageTitle + ' | ngBoilerplate';
            }
        });

        function logout() {
            Auth.logout(function () {
                $location.path('/');
            });
        }

        function clearError() {
            $rootScope.error = null;
        }
    }



})();
