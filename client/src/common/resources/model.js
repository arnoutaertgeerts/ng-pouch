angular.module('model', [
    'database'
])
    .factory('model', [
        '$http',
        '$q',
        'database',
        function ($http, $q, database) {
            var db = database.db;

            function factory(type) {

                var promiseMethod = function (promise) {
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
                };

                var Model = function (data) {
                    angular.extend(this, data);
                    if (!this.type) {
                        this["type"] = type;
                    }
                };

                Model.query = function(fun, options) {
                    return db.query(fun, options);
                };

                Model.all = function() {
                    return Model.query('type/' + type).then(promiseMethod);
                };

                Model.prototype.$save = function () {
                    if (!this._id) {
                        return db.post(this);
                    } else {
                        return db.put(this);
                    }
                };

                Model.prototype.$delete = function() {
                    return db.remove(this);
                };

                return Model;
            }

            return factory;
        }]);
