var ctrl =  require('../auth.js');

module.exports = function (app) {
    app.post('/register', ctrl.addUser);

    app.post('/login', ctrl.login);

    app.post('/logout', ctrl.logout);
};
