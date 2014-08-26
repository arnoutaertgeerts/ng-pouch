angular.module('admin', [
    'ui.router',
    'trNgGrid',
    'model.todo'
])

    .config(function config($stateProvider) {
        $stateProvider.state('admin', {
            url: '/admin',
            views: {
                "main": {
                    controller: 'AdminCtrl',
                    templateUrl: 'admin/admin.tpl.html'
                }
            },
            data: {
                pageTitle: 'Admin',
                access: 'user'
            }
        });
    })

    .controller('AdminCtrl', function AdminController($scope, Todo, database, $modal) {
        Todo.all().then(function(res) {
            $scope.todos = res;
        });

        $scope.newTodo = function() {
            var todo = Todo.example();
            todo.$save().then(function(res) {
                $scope.todos.push(todo);
            });
        };

        $scope.remove = function(todo) {
            todo.$remove().then(function(res) {
                $scope.todos.splice($scope.todos.indexOf(todo),1);
            });
        };

        $scope.edit = function(todo) {

            var modal = $modal.open({
                templateUrl: 'todoModal.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    edit: function () {
                        return angular.copy(todo);
                    }
                }
            });

            modal.result.then(function(data) {
                data.$save().then(function(res) {
                    $scope.todos[$scope.todos.indexOf(todo)] = data;
                });

            }, function() {

            });
        };

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
    });
