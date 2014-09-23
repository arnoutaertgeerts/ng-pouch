angular.module('model', [
    'database',
    'cfp.loadingBar',
    'toaster'
])
    .factory('model', [
        '$http',
        '$q',
        'database',
        'userdb',
        'cfpLoadingBar',
        'toaster',
        '$rootScope',

        function ($http, $q, database, userdb, cfpLoadingBar, toaster, $rootScope) {

            function factory(type) {
                var db;

                if(type === 'user') {
                    db = userdb.db;
                } else {
                    db = database.db;
                }

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

                var catchMethod = function(err) {
                    if (err.status >= 400 && err.status < 500) {
                        $rootScope.$emit('couch:unauthorized', err.message);
                    } else {
                        $rootScope.$emit('couch:error', err.message);
                    }
                };

                var Model = function (data) {
                    angular.extend(this, data);

                    if (type !== 'user') {
                        if (!this.type) {
                            this["type"] = type;
                        }
                    }
                };

                Model.db = db;

                Model.query = function(fun, options) {
                    return db.query(fun, options).catch(catchMethod);
                };

                Model.all = function() {
                    cfpLoadingBar.start();

                    return Model.query('type/' + type).then(promiseMethod).catch(function(err) {
                        toaster.pop('error', 'Something went wrong getting your request :(', err.message);

                    }).catch(catchMethod).finally(function() {
                        cfpLoadingBar.complete()
                    });
                };

                Model.prototype.$save = function () {
                    cfpLoadingBar.start();

                    var model = this;
                    if (!model._id) {
                        return db.post(model).then(function(res) {
                            model._rev = res.rev;
                            toaster.pop('success', 'All changes saved');

                        }).catch(function(err) {
                            toaster.pop('error', 'Something went wrong saving your request :(', err.message);

                        }).finally(function() {
                            cfpLoadingBar.complete()
                        });
                    } else {
                        return db.put(model).then(function(res) {
                            model._rev = res.rev;

                            toaster.pop('success', 'All changes saved');

                        }).catch(function(err) {
                            toaster.pop('error', 'Something went wrong saving your request :(', err.message);

                        }).finally(function() {
                            cfpLoadingBar.complete()
                        });
                    }
                };

                Model.prototype.$remove = function() {
                    cfpLoadingBar.start();

                    return db.remove(this).then(function(res) {
                        toaster.pop('info', 'Item successfully deleted');

                    }).catch(function(err) {
                        toaster.pop('error', 'Something went wrong deleting your item :(', err.message);

                    }).finally(function() {
                        cfpLoadingBar.complete()
                    });
                };

                Model.promiseMethod = promiseMethod;
                Model.catchMethod = catchMethod;

                return Model;
            }

            return factory;
        }]);
