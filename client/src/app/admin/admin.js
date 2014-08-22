angular.module('admin', [
    'ui.router',
    'trNgGrid',
    'model.todo',
    'database'
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

    .controller('AdminCtrl', function AdminController($scope, Todo, database) {
        var db = database.db;

        Todo.all().then(function(res) {
            console.log(res);
        }, function(err) {
            console.log(err);
        });

        $scope.newTodo = function() {
            var todo = Todo.example();
            todo.$save().then(function(res) {
                console.log(res);
            }, function(err) {
                console.log(err);
            });
        };
    });
