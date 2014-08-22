
var ctrl =  require('./dokter-controllers'),
    auth =  require('./../auth.js');

module.exports = function (app, auth) {
    app.namespace('/api/doctors', function () {
        //Query the doctors database
        //TODO: Needs Admin rights
        app.get('/', ctrl.query);

        //Update a doctor profile
        app.put('/:id', auth.adminRequired, ctrl.update);

        //Default user to easily add correct new items to the database
        app.get('/default', auth.adminRequired, ctrl.default);

        //Delete a doctor
        app.delete('/:id', auth.adminRequired, ctrl.remove);
    });
};
