//Id of the design doc
ddoc = {
    _id: '_design/auth'
};

//Validation function
ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {
    if (userCtx.roles.indexOf('user') && userCtx.roles.indexOf('_admin') === -1) {
        throw "Only admins or users can change documents on this database.";
    }
};

module.exports = ddoc;