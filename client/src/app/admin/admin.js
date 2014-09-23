(function() {
    'use strict';

    angular
        .module('admin')
        .controller('AdminCtrl', AdminCtrl);

    AdminCtrl.$inject = ['$scope', 'Todo', 'database', '$modal'];

    function AdminCtrl($scope, Todo, database, $modal) {
        var vm = this;

        vm.todos = [];
        vm.newTodo = newTodo;
        vm.remove = remove;
        vm.edit = edit;

        loadTodos();


        function loadTodos() {
            Todo.all().then(function (res) {
                vm.todos = res;
            });
        }

        function newTodo() {
            var todo = Todo.example();
            todo.$save().then(function (res) {
                vm.todos.push(todo);
            });
        }

        function remove(todo) {
            todo.$remove().then(function (res) {
                vm.todos.splice(vm.todos.indexOf(todo), 1);
            });
        }

        function edit(todo) {

            var modal = $modal.open({
                templateUrl: 'todoModal.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    edit: function () {
                        return angular.copy(todo);
                    }
                }
            });

            modal.result.then(function (data) {
                data.$save().then(function (res) {
                    vm.todos[vm.todos.indexOf(todo)] = data;
                });

            }, function () {

            });
        }

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
