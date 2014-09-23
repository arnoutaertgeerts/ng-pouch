(function() {
    'use strict';

    angular
        .module('authorization')
        .directive('accessLevel', accessLevelDirective);

    accessLevelDirective.$inject = ['Auth'];

    function accessLevelDirective(Auth) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var prevDisp = element.css('display'),
                    userRole,
                    accessLevel;

                $scope.user = Auth.user;
                $scope.$watch('user', function (user) {
                    if (user.roles) {
                        userRole = user.roles;
                    }
                    updateCSS();
                }, true);

                attrs.$observe('accessLevel', function (al) {
                    if (al) {
                        accessLevel = al;
                    }
                    updateCSS();
                });

                function updateCSS() {
                    if (userRole && accessLevel) {
                        if (!Auth.authorize(accessLevel, userRole)) {
                            element.css('display', 'none');
                        }
                        else {
                            element.css('display', prevDisp);
                        }
                    }
                }
            }
        };
    }

})();