'use strict';

var express =           require('express'),
    http =              require('http'),
    path =              require('path'),
    morgan =            require('morgan'),
    bodyParser =        require('body-parser'),
    methodOverride =    require('method-override'),
    cookieParser =      require('cookie-parser'),
    session =           require('express-session'),
    csrf =              require('csurf'),
    errorHandler =      require('errorhandler'),
    config =            require('./lib/config.js');

require('express-namespace');

var app = module.exports = express();

//SEO middleware
app.use(function (req, res, next) {
    var fragment = req.query._escaped_fragment_;

    // If there is no fragment in the query params
    // then we're not serving a crawler
    if (!fragment) {
        return next()
    };

    // If the fragment is empty, serve the
    // index page
    if (fragment === "" || fragment === "/")
        fragment = "/home.html";

    // If fragment does not start with '/'
    // prepend it to our fragment
    if (fragment.charAt(0) !== "/")
        fragment = '/' + fragment;

    // If fragment does not end with '.html'
    // append it to the fragment
    if (fragment.indexOf('.html') == -1)
        fragment += ".html";

    // Serve the static html snapshot
    try {
        var file = root + "/snapshots" + fragment;
        res.sendfile(file);
    } catch (err) {
        res.send(404);
    }
});

//Express middleware
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({secret: "keyboard cat"}));

var env = process.env.NODE_ENV || 'debug';
if ('development' === env || 'production' === env) {
    app.use(csrf());
    app.use(function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
}

//A standard error handler - it picks up any left over errors and returns a nicely formatted server 500 error
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));

//require('./app/app-routes/authorization.js')(app);
require('./app/users/user.routes.js')(app);

//HTML5 Mode (needs to be the last route added)
require('./app/app-routes/html5mode').addRoutes(app, config);


app.set('port', process.env.PORT || 8000);
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
