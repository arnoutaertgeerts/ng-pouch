(function () {
    'use strict';

    angular
        .module('app', [
            //Templates
            'templates-app',
            'templates-common',
            //Pages
            'home',
            'admin',
            'about',
            'register',
            'login',
            'user',
            'live',
            //Plugins
            'authorization',
            'toaster',
            'ui.router',
            'ngSanitize',
            'cfp.loadingBar'
        ]);



})();
