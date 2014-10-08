(function() {
    'use strict';

    angular
        .module('authorization',  [
            'ngCookies',
            'sofa',
            'model.user',
            'toaster'
        ]);
})();