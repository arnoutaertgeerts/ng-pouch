(function() {
    'use strict';

    angular
        .module('admin')
        .controller('AdminCtrl', AdminCtrl);

    AdminCtrl.$inject = ['$scope', 'database', '$modal'];

    function AdminCtrl($scope, database, $modal) {
        var vm = this;


        /**
         * @ngInject
         */
        var ModalInstanceCtrl = function ($scope, $modalInstance, edit) {
            $scope.edit = edit;

            $scope.submit = function (data) {
                $modalInstance.close(data);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
    }

})();
