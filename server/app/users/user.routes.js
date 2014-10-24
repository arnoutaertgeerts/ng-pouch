var controller = require('./user.controller.js');

module.exports = function(app) {
    app.post('/login', login);
    app.post('/signup', signup);
    app.post('/update', update);
    app.post('/unique/email', checkIfMailUnique);
    app.post('/unique/name', checkIfNameUnique);
};

function login(req, res) {
    controller.login(req.body.name, req.body.password).then(function(cookie) {
        console.log(cookie);
        res.cookie('AuthSession', cookie.AuthSession);
        res.json(200, 'OK');
    }).catch(function(err) {
        res.json(409, err);
    })
}

function signup(req, res) {
    var user = req.body;

    controller.signup(user).then(function() {
        res.json(200, 'User created')
    }).catch(function(err) {
        res.json(400, err)
    })
}

function update(req, res) {
    var user = req.body;
    var cookie = req.cookies.AuthSession;

    controller.update(user, cookie).then(function() {
        res.json(200, 'User updated')
    }).catch(function(err) {
        res.json(400, err)
    })
}

function checkIfMailUnique(req, res) {
    var email = req.body;

    controller.checkIfMailUnique(email).then(function() {
        res.json(200, 'OK')
    }).catch(function(err) {
        res.json(400, err)
    })

}

function checkIfNameUnique(req, res) {
    var name = req.body;

    controller.checkIfNameUnique(name).then(function() {
        res.json(200, 'OK')
    }).catch(function(err) {
        res.json(400, err)
    })

}
