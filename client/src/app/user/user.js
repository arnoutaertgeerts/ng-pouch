(function() {
    'use strict';

    angular
        .module('user')
        .controller('UserCtrl', UserCtrl);

    UserCtrl.$inject = [
        '$scope',
        '$modal',
        'Auth'
    ];

    function UserCtrl($scope, $modal, Auth) {
        var vm = this;

        vm.user = Auth.user;
        vm.save = save;
        vm.openPasswordModal = openPasswordModal;
        vm.openUserModal = openUserModal;


        function save() {
            vm.user.$save().then(Auth.update());
        }

        function openPasswordModal() {
            var modal = $modal.open({
                templateUrl: 'passwordModal.html',
                controller: PasswordModalCtrl
            });
        }

        function openUserModal() {
            var modal = $modal.open({
                templateUrl: 'userModal.html',
                controller: UserModalCtrl,
                resolve: {
                    user: function () {
                        return angular.copy(vm.user);
                    }
                }
            });

            modal.result.then(function (user) {
                user.$save().then(function (res) {
                    vm.user = user;
                    Auth.update();

                });
            })
        }

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

        var UserModalCtrl = function ($scope, $modalInstance, user) {
            $scope.user = user;

            $scope.submit = function (data) {
                $modalInstance.close(data)
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }
    }

})();
