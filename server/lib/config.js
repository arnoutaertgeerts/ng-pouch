path = require('path');

module.exports = {
    app: {
        name: "MEAN - A Modern Stack - Development"
    },
    mongo: {
        connectionURL: 'mongodb://admin:Swiffer7024@ds033559.mongolab.com:33559/bleyenbergh'
    },
    security: {
        dbName: 'whatsin',                                      // The name of database that contains the security information
        usersCollection: 'users'                                // The name of the collection contains user information
    },
    server: {
        listenPort: 3000,                                               // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
        securePort: 8433,                                               // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
        distFolder: path.resolve(__dirname, '../../client/build'),    // The folder that contains the application files (note that the files are in a different repository) - relative to this file
        staticUrl: '/static',                                           // The base url from which we serve static files (such as js, css and images)
        cookieSecret: 'angular-app'                                     // The secret for encrypting the cookie
    },
    facebook: {
        clientID: "1382965431925830",
        clientSecret: "bf472a4d2de176e9144bd7a49f0da23c",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
        clientID: "CONSUMER_KEY",
        clientSecret: "CONSUMER_SECRET",
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    google: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/google/callback"
    }
};