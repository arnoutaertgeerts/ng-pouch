(function() {
    'use strict';

    angular
        .module('sofa')
        .factory('Model', Model);

    Model.$inject = [
        '$http',
        '$q',
        'Database',
        '$rootScope'
    ];

    function Model ($http, $q, Database, $rootScope) {

        function factory(databaseName, type) {
            var db = Database(databaseName);

            var Model = InitModel;
            Model.db = db;
            Model.query = query;
            Model.all = all;

            Model.prototype.$save = save;
            Model.prototype.$remove = remove;

            Model.promiseMethod = promiseMethod;
            Model.catchMethod = catchMethod;

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
                return db.query(fun, options).catch(catchMethod);
            }

            function all() {
                $rootScope.$emit('req:start');

                return Model.query('type/' + type).then(promiseMethod).catch(function(err) {
                    $rootScope.$emit('model:error', err.message);

                }).catch(catchMethod).finally(function() {
                    $rootScope.$emit('req:end');
                });
            }

            function save() {
                $rootScope.$emit('req:start');

                var model = this;
                if (!model._id) {
                    return db.post(model).then(function(res) {
                        model._rev = res.rev;
                        $rootScope.$emit('model:create');

                    }).catch(function(err) {
                        $rootScope.$emit('model:error', err.message);

                    }).finally(function() {
                        $rootScope.$emit('req:end');
                    });
                } else {
                    return db.put(model).then(function(res) {
                        model._rev = res.rev;

                        $rootScope.$emit('model:update');

                    }).catch(function(err) {
                        $rootScope.$emit('model:error', err.message);

                    }).finally(function() {
                        $rootScope.$emit('req:end');
                    });
                }
            }

            function remove() {
                $rootScope.$emit('req:start');

                return db.remove(this).then(function(res) {
                    $rootScope.$emit('model:remove');

                }).catch(function(err) {
                    $rootScope.$emit('model:error', err.message);

                }).finally(function() {
                    $rootScope.$emit('req:end');
                });
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

            function catchMethod(err) {
                if (err.status >= 400 && err.status < 500) {
                    $rootScope.$emit('req:unauthorized', err.message);
                } else {
                    $rootScope.$emit('req:error', err.message);
                }
            }


        }

        return factory;
    }

})();