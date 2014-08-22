var mongoose = require('mongoose');
    utility = require('../../lib/utility.js');
    Doctor = mongoose.model('Doctor');

//Default Doctor model
exports.default = function(req, res, next) {
    var doc = new Doctor();
    doc.save();
    res.send(200, doc);
};

//Query the Doctor collection
exports.query = function (req, res, next) {
    var query = JSON.parse(req.query.q);

    console.log('Query: %s', query);
    Doctor.find(query).lean().exec(function (err, result) {
        if (!err) {
            if (result.length > 0) {
                res.send(result);
            }
            else {
                res.send(404, 'null');
            }
        } else {
            res.send(404, 'null');
            return console.log(err);
        }
    });
};

//Update a doctor
exports.update = function (req, res) {
    Doctor.findById(req.params.id, function (err, doc) {
        if (!err) {
            utility.updateDocument(doc, Doctor, req.body);
            doc.save(function (err) {
                if (!err) {
                    res.send(200,
                        {"messages": [
                            {"text": "All changes saved", "severity": "success"}
                        ]}
                    );
                }
                else {
                    res.send(400,
                        {"messages": [
                            {"text": "Something went wrong saving your request", "severity": "error"}
                        ]}
                    );
                }
            });

        }
        else {
            res.send(400,
                {"messages": [
                    {"text": "Something went wrong saving your request", "severity": "error"}
                ]});
        }
    });
};

exports.remove = function(req, res) {
    Doctor.findById(req.params.id, function (err, doc) {
        if(err) {
            console.log(err);
            utility.sendNotification(res, 400, 'Doctor could not be deleted', 'error');
        }
        if(!doc) {
            utility.sendNotification(res, 400, 'Doctor could not be found?', 'warning');
        }
        else {
            doc.remove(function(err) {
                if(err) {
                    console.log(err);
                    utility.sendNotification(res, 400, 'Doctor could not be deleted', 'error');
                }
                else {utility.sendNotification(res, 200, 'Doctor deleted', 'success');}
            });
        }
    });
};
