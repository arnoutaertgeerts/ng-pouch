(function() {
    'use strict';

    angular
        .module('sofa')
        .factory('PouchyngCommon', PouchyngCommon);

    PouchyngCommon.$inject = [
        '$q',
        '$timeout',
        'Yng',
        'yngutils'
    ];

    function PouchyngCommon($q, $timeout, Yng, yngutils) {
        return function (name, url, filter, sortBy) {
            var that = this;
            this.yng = new Yng(name, url, sortBy);
            this.db = null;
            this.to = null;
            this.from = null;
            this.changes = null;

            this.provider = function () {
                return that.db;
            };

            this.bound = function () {
                return that.db ? true : false;
            };

            this.bind = function (scope) {
                if (that.bound()) { // already bound
                    return that.yng.bindModel(scope);
                } else {
                    // use a unique id as the name to prevent duplicate db names across adapters
                    that.db = new PouchDB(that.yng.name + '_' + that.yng.nextId());

                    // For some reason, pouch appears to require more event listeners than the default 11.
                    // Pouch appears to register several 'destroyed' handlers. Is this really necessary?
                    that.db.setMaxListeners(20);

                    that.yng.scope = scope;
                    that.db.on('error', that.yng.error);
                    return $timeout(function () {
                        return sync();
                    });
                }
            };

            function syncError(err) {
                // Appears we need to ignore error events with null parameters
                /* istanbul ignore if */
                if (err) {
                    that.yng.error(err);
                }
            }

            function onUpToDate() {
                that.yng.emit('uptodate');
            }

            function onLoadFactory(defer) {
                return function () {
                    return that.map().then(function () {
                        that.yng.sortIfNeeded();
                        return that.yng.bindModel(that.yng.scope).then(defer.resolve);
                    });
                };
            }

            function sync() {
                return that.db.info().then(function (info) {
                    var defer = $q.defer();
                    /* jshint camelcase: false */
                    that.changes = that.db.changes({
                        since: info.update_seq,
                        live: true
                    });
                    that.registerListeners();
                    var opts;
                    if (filter) {
                        opts = {
                            live: true,
                            filter: filter
                        };
                    } else {
                        opts = {live: true};
                    }
                    var remoteCouch = that.yng.url + '/' + that.yng.name;

                    // If the local pouch database doesn't already exist then we need to wait for the
                    // uptodate or error events before a call to allDocs() will return all the data in the
                    // remote database.
                    that.to = that.db.replicate.to(remoteCouch, opts, syncError);
                    that.from = that.db.replicate.from(remoteCouch, opts, syncError)
                        .once('uptodate', onLoadFactory(defer))
                        .on('uptodate', onUpToDate)
                        .once('error', onLoadFactory(defer))
                        .on('complete', onUpToDate);
                    return defer.promise;
                });
            }

            this.cancel = function () {
                /* istanbul ignore next */
                if (that.changes) {
                    that.changes.cancel();
                }
                /* istanbul ignore next */
                if (that.to) {
                    that.to.cancel();
                }
                /* istanbul ignore next */
                if (that.from) {
                    that.from.cancel();
                }
            };

            function destroyRemoteDb() {
                // Calling db.destroy() only removes the local database, we need to remove the remote
                // database separately
                var remoteDb = new PouchDB(that.yng.url + '/' + that.yng.name);
                return yngutils.doAndOnce(function () {
                    return remoteDb.destroy();
                }, 'destroyed', remoteDb);
            }

            this.destroy = function (preserveRemote) {
                that.cancel();

                var localPromise = yngutils.doAndOnce(function () {
                    return that.db.destroy();
                }, 'destroyed', this.db);
                var promises = [localPromise];

                if (!preserveRemote) {
                    promises.push(destroyRemoteDb());
                }

                return $q.all(promises).then(function () {
                    return that.yng.destroy();
                });
            };

            this.copyApi = function (obj) {
                that.yng.copyApi(obj);

                var fns = [
                    'provider',
                    'bound',
                    'bind',
                    'destroy'
                ];
                yngutils.copyFns(fns, that, obj);
            };

        };
    }

})();