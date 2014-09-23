(function() {
    'use strict';

    angular
        .module('about')
        .controller('AboutCtrl', AboutCtrl);

    AboutCtrl.$inject = [];

    function AboutCtrl() {
        var vm = this;

        vm.dropDownDemoItems = [
            "The first choice!",
            "And another choice for you.",
            "but wait! A third!"
        ];
    }

})();
