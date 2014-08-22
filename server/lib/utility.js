//http://stackoverflow.com/questions/9369794/nodejs-mongoose-updating-all-fields-on-a-mongoose-model

var _ = require('underscore'),
    Q = require('q');

//Updates a document using an entire document but only updates the changed fields
exports.updateDocument = function (doc, SchemaTarget, data) {
    for (var field in SchemaTarget.schema.paths) {
        if ((field !== '_id') && (field !== '__v')) {
            var newValue = getObjValue(field, data);
            console.log('data[' + field + '] = ' + newValue);
            if (newValue !== undefined) {
                setObjValue(field, doc, newValue);
            }
        }
    }
    for (var field in SchemaTarget.schema.virtuals) {
        if ((field !== 'id') && (field !== '__v')) {
            var newValue = getObjValue(field, data);
            console.log('data[' + field + '] = ' + newValue);
            if (newValue !== undefined) {
                setObjValue(field, doc, newValue);
            }
        }
    }
    return doc;
};

function getObjValue(field, data) {
    return _.reduce(field.split("."), function (obj, f) {
        if (obj) return obj[f];
    }, data);
}

function setObjValue(field, data, value) {
    var fieldArr = field.split('.');
    return _.reduce(fieldArr, function (o, f, i) {
        if (i == fieldArr.length - 1) {
            o[f] = value;
        } else {
            if (!o[f]) o[f] = {};
        }
        return o[f];
    }, data);
}

//Check if a value already exists in Mongoose
exports.checkUnique = function (value, Model, field) {
    var deferred = Q.defer();

    Model.find().where(field, value).exec(function (err, result) {
        if (result.length >= 1) {
            console.log(field, value);
            deferred.resolve(false);
        }
        if (err) {
            deferred.reject(err);
        }
        deferred.resolve(true);
    });

    return deferred.promise;
};

//Success growl notification callback
exports.sendNotification = function (res, status, message, severity) {
    res.send(status,
        {"messages": [
            {"text": message, "severity": severity}
        ]});
};
