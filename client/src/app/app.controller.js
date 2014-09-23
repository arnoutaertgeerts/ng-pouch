(function() {
    'use strict';


    angular
        .module('app')
        .controller('AppCtrl', AppCtrl);


    AppCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$location',
        'Auth'
    ];


    function AppCtrl($rootScope, $scope, $location, Auth) {
        var vm = this;

        vm.logout = logout;
        vm.clearError = clearError;


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
