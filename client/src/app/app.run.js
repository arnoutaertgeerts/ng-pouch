(function () {
    'use strict';


    angular
        .module('app')
        .run(Run);


    Run.$inject = [
        '$rootScope',
        '$state',
        'Auth'
    ];

    function Run($rootScope, $state, Auth) {


        $rootScope.$on("$stateChangeStart", checkAuth);


        function checkAuth(event, toState, toParams, fromState, fromParams) {

            if (!Auth.authorize(toState.data.access)) {
                event.preventDefault();

                if (Auth.isLoggedIn()) {
                    $state.go('user.home');
                } else {
                    $state.go('login');
                }
            }
        }
    }

})();
