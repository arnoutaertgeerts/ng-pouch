//Check if a value is unique on the server side
angular.module('validation.unique', []);

angular.module('validation.unique').directive('unique', ['$http', function ($http) {
    // http://stackoverflow.com/questions/12864887/angularjs-integrating-with-server-side-validation
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var url = attrs.unique;

            scope.busy = false;
            scope.$watch(attrs.ngModel, function (value) {

                // hide old error messages
                ctrl.$setValidity('isTaken', true);
                ctrl.$setValidity('invalidChars', true);

                if (!value) {
                    // don't send undefined to the server during dirty check
                    // empty username is caught by required directive
                    return;
                }

                scope.busy = true;
                $http.post(url, {field: value})
                    .success(function (data) {
                        // everything is fine -> do nothing
                        scope.busy = false;
                    })
                    .error(function (data) {

                        // display new error message
                        if (data.isTaken) {
                            ctrl.$setValidity('isTaken', false);
                        } else if (data.invalidChars) {
                            ctrl.$setValidity('invalidChars', false);
                        }

                        scope.busy = false;
                    });
            });
        }
    };
}]);

