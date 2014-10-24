(function() {
    'use strict';

    angular
        .module('sofa')
        .factory('Model', Model);

    Model.$inject = [
        'Database',
        '$rootScope'
    ];

    function Model (Database, $rootScope) {

        function factory(databaseName, type) {
            var db = Database(databaseName);

            var Model = InitModel;
            Model.db = db;
            Model.query = query;
            Model.all = all;

            Model.prototype.$save = save;
            Model.prototype.$remove = remove;

            Model.promiseMethod = promiseMethod;

            return Model;

            function InitModel(data) {
                angular.extend(this, data);

                if (type !== 'user') {
                    if (!this.type) {
                        this["type"] = type;
                    }
                }
            }

            function query(fun, options) {
                return db.query(fun, options)
            }

            function all() {

                return Model.query('type/' + type).then(promiseMethod)
            }

            function save() {

                var model = this;
                if (!model._id) {
                    return db.post(model).then(function(res) {
                        model._rev = res.rev;
                        $rootScope.$emit('model:create');

                    })
                } else {
                    return db.put(model).then(function(res) {
                        model._rev = res.rev;

                        $rootScope.$emit('model:update');

                    })
                }
            }

            function remove() {
                return db.remove(this).then(function(res) {
                    $rootScope.$emit('model:remove');
                })
            }

            function promiseMethod(promise) {
                var result;
                if (promise.rows.length > 1) {
                    result = [];

                    for (var i = 0; i < promise.rows.length; i++) {
                        result.push(new Model(promise.rows[i].key));
                    }

                    return result;
                }
                else {
                    result = new Model(promise.rows[0].key);
                    return result;
                }
            }
        }

        return factory;
    }

})();