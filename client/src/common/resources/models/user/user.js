(function() {
    'use strict';

    angular
        .module('model.user')
        .factory('User', User);

    User.$inject = [
        'Model',        
    ];

    function User(Model) {
        var userModel = Model('https://housemt.iriscouch.com/_users', 'user');
        
        return userModel;
    }

})();
