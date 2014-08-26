angular.module('user', [
    'ui.router',
    'ui.bootstrap',
    'authorization',
    'model.user'
])

    /*
     * Route
     * */
    .config(function config($stateProvider) {
        var access = routingConfig.accessLevels;

        $stateProvider.state('user', {
            url: '/user',
            views: {
                "main": {
                    controller: 'UserCtrl',
                    templateUrl: 'user/user.tpl.html'
                }
            },
            data: {
                pageTitle: 'My Profile',
                access: 'user'
            }
        });
    })

    /*
     * Controller
     * */
    .controller('UserCtrl', [
        '$scope',
        '$modal',
        'Auth',
        'User',
        function ($scope, $modal, Auth) {
            $scope.user = Auth.user;

            $scope.save = function() {
                $scope.user.$save().then(Auth.update());
            };

            $scope.openModal = function() {
                var modal = $modal.open({
                    templateUrl: 'passwordModal.html',
                    controller: ModalInstanceCtrl
                });
            };

            var ModalInstanceCtrl = function ($scope, $modalInstance) {
                $scope.data = {};

                $scope.submit = function (data) {
                    Auth.changePassword(data.oldPassword, data.newPassword);
                    $modalInstance.close();
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }]);