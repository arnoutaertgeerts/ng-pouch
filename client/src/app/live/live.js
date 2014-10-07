(function() {
    'use strict';

    angular
        .module('live')
        .controller('LiveCtrl', LiveCtrl);

    LiveCtrl.$inject = [
        '$scope',
        '$timeout',
        'todos'
    ];

    function LiveCtrl($scope, $timeout, todos) {
        var vm = this;

        todos.bind(vm);

        vm.create = create;
        vm.remove = remove;
        vm.update = update;

        function create() {
            todos.create({
                title: 'Create a new doc',
                type: 'post'
            }).then(function () {
                console.log('success')
            }).catch(function(err) {
                console.log(err)
            })
        }

        function remove(doc) {
            todos.remove(doc).then(function () {
                console.log('success')
            }).catch(function(err) {
                console.log(err)
            })
        }

        function update(doc) {
            doc.text = "I'm updated!";
            todos.update(doc).then(function () {
                console.log('success')
            }).catch(function(err) {
                console.log(err)
            })
        }

    }

})();