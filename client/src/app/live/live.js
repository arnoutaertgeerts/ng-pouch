(function() {
    'use strict';

    angular
        .module('live')
        .controller('LiveCtrl', LiveCtrl);

    LiveCtrl.$inject = [
        '$scope',
        '$timeout',
        'Pouchyng'
    ];

    function LiveCtrl($scope, $timeout, Pouchyng) {
        var vm = this;

        var todos = new Pouchyng("todos", 'https://housemt.couchappy.com/').bind(vm);

    }

})();