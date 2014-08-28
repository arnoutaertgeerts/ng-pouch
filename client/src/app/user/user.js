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
        function ($scope, $modal, Auth, User) {
            $scope.user = Auth.user;

            Auth.checkMail('arnoutaertgeerts@gmail.com');


            $scope.save = function() {
                $scope.user.$save().then(Auth.update());
            };

            $scope.openPasswordModal = function() {
                var modal = $modal.open({
                    templateUrl: 'passwordModal.html',
                    controller: PasswordModalCtrl
                });
            };

            $scope.openUserModal = function() {
                var modal = $modal.open({
                    templateUrl: 'userModal.html',
                    controller: UserModalCtrl,
                    resolve: {
                        user: function() {
                            return angular.copy($scope.user);
                        }
                    }
                });

                modal.result.then(function(user) {
                    user.$save().then(function(res) {
                        $scope.user = user;
                        Auth.update(user);

                    });
                })
            };

            var PasswordModalCtrl = function ($scope, $modalInstance) {
                $scope.data = {};

                $scope.submit = function (data) {
                    Auth.changePassword(data.oldPassword, data.newPassword);
                    $modalInstance.close();
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            var UserModalCtrl = function($scope, $modalInstance, user) {
                $scope.user = user;

                $scope.submit = function(data) {
                    $modalInstance.close(data)
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        }]);