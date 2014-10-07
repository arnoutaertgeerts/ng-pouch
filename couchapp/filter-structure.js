//Id of the design doc
ddoc = {
    _id: '_design/filters'
};

//Filter function
ddoc.filters = {
    "structure": function (doc, req) {
        return true;

        /*var params = req.params;
        var value = req.value;

        for (var i = 0; i < params.length; i++) {
            if (!doc || !doc.hasOwnProperty(params[i])) {
                return false;
            }
            doc = doc[params[i]];
        }

        return doc.value === value;*/

    }
};

module.exports = ddoc;