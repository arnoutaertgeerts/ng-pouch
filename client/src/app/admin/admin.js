angular.module('admin', [
    'ui.router',
    'trNgGrid',
    'model.todo',
    'toaster'
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

    .controller('AdminCtrl', function AdminController($scope, Todo, database, toaster, $modal) {
        Todo.all().then(function(res) {
            $scope.todos = res;
        }, function(err) {
            toaster.pop('error', err);
        });

        $scope.newTodo = function() {
            var todo = Todo.example();
            todo.$save().then(function(res) {
                $scope.todos.push(todo);
            }, function(err) {
                toaster.pop('error', err);
            });
        };

        $scope.remove = function(todo) {
            todo.$remove().then(function(res) {
                $scope.todos.splice($scope.todos.indexOf(todo),1);
                toaster.pop('info', 'Item successfully deleted');
            }, function(err) {
                toaster.pop('error', 'Something went wrong :(', err.message);
            });
        };

        $scope.edit = function(todo) {
            var modal = $modal.open({
                templateUrl: 'todoModal.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    todo: function () {
                        return todo;
                    }
                }
            });

            modal.result.then(function(todo) {
                todo.$save().then(function(res) {
                    toaster.pop('success', 'All changes saved');
                }, function(err) {
                    toaster.pop('error', 'Something went wrong :(', err.message);
                });

            });
        };

        /**
         * @ngInject
         */
        var ModalInstanceCtrl = function ($scope, $modalInstance, todo) {
            $scope.todo = todo;

            $scope.submit = function (data) {
                $modalInstance.close(data);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
    });
