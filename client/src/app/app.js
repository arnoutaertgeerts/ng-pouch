angular.module('ngBoilerplate', [
    //Templates
    'templates-app',
    'templates-common',
    //Pages
    'home',
    'admin',
    'about',
    'register',
    'login',
    'user',
    //Plugins
    'authorization',
    'toaster',
    'ui.router',
    'ngSanitize',
    'angular-loading-bar'
])

    .config(function myAppConfig($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/home');

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        });

        // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
        $urlRouterProvider.rule(function ($injector, $location) {
            if ($location.protocol() === 'file') {
                return;
            }

            var path = $location.path(),
            // Note: misnomer. This returns a query object, not a search string
                search = $location.search(),
                params;

            // check to see if the path already ends in '/'
            if (path[path.length - 1] === '/') {
                return;
            }

            // If there was no search string / query params, return with a `/`
            if (Object.keys(search).length === 0) {
                return path + '/';
            }

            // Otherwise build the search string and return a `/?` prefix
            params = [];
            angular.forEach(search, function (v, k) {
                params.push(k + '=' + v);
            });
            return path + '/?' + params.join('&');
        });

    })

    .run(['$rootScope', '$state', 'Auth', function run($rootScope, $state, Auth) {

        /*
         * Check the accessibility rights before changing route
         * */
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

            if (!Auth.authorize(toState.data.access)) {
                event.preventDefault();

                if (Auth.isLoggedIn()) {
                    $state.go('user.home');
                } else {
                    $state.go('login');
                }
            }
        });
    }])

    .controller('AppCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        'Auth',
        function AppCtrl($rootScope, $scope, $location, Auth) {
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (angular.isDefined(toState.data.pageTitle)) {
                    $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate';
                }
            });

            $scope.logout = function() {
                Auth.logout(function() {
                    $location.path('/');
                });
            };

            $scope.clearError = function() {
                $rootScope.error = null;
            };
        }]);