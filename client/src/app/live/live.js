(function() {
    'use strict';

    angular
        .module('live')
        .controller('LiveCtrl', LiveCtrl);

    LiveCtrl.$inject = [
        '$rootScope',
        'TodoSync',
        'TodoModel'
    ];

    function LiveCtrl($rootScope, TodoSync, TodoModel) {
        var vm = this;

        TodoSync.bind(vm);

        //Sync methods
        vm.create = create;
        vm.remove = remove;
        vm.update = update;

        //Model methods
        vm.createModel = createModel;
        vm.removeModel = removeModel;

        function create() {
            TodoSync.create({
                title: 'Create a new doc',
                type: 'post'
            }).then(function () {
                console.log('success')
            }).catch(function(err) {
                console.log(err)
            })
        }

        function remove(doc) {
            TodoSync.remove(doc).then(function () {
                console.log('success')
            }).catch(function(err) {
                console.log(err)
            })
        }

        function update(doc) {
            doc.text = "I'm updated!";
            TodoSync.update(doc).then(function () {
                console.log('success')
            }).catch(function(err) {
                console.log(err)
            })
        }

        function createModel() {
            var newTodo = new TodoModel({
            'title': 'Created with the Model factory'
            });

            newTodo.$save().then(function() {
                console.log('success');
            }).catch(function(err) {
                console.log(err)
            })
        }

        function removeModel(doc) {
            var todo = new TodoModel(doc);

            todo.$remove();
        }

    }

})();