(function() {
    'use strict';

    angular
        .module('authorization',  [
            'ngCookies',
            'database',
            'model.user',
            'toaster'
        ]);
})();