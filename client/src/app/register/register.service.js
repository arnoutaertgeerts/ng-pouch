(function() {
    'use strict';

    angular
        .module('register')
        .service('UserSignUp', UserSignUp);


    UserSignUp.$inject = [];

    function UserSignUp() {
        this.validationRules = {
            email: {
                required: true,
                pattern: /^\w+@\w+\.\w+$/ // Simple email format
            },
            password: {
                required: true,
                minlength: 5
            }
        };

        return this;
    }

})();