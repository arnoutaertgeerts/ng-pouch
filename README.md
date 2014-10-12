ng-pouch
========

Full stack angular app using pouchDB/couchDB to store data and handle security. The app is a boilerplate to quickly start an angular web-app with a backend which tries to be as independent of a server as possible.

- [Installation](#installation)
- [Guide](#guide)
  - [Angular app](#angular)
  - [CouchDB configuration](#couchdbconfig)
- [Stack](#stack)
- [Roadmap](#roadmap)
- [Inspiration](#inspiration)
- [Contribute](#contribute)

## Installation<a name="installation"></a>


The core of the app is an angular app served by a minimal express app. To deploy the app, clone the repository:
```
git clone https://github.com/arnoutaertgeerts/ng-pouch/ myApp
```
Navigate to the ```client``` directory and install the client dependencies:
```
cd myApp/client
bower install
npm install
````
Navigate to the ```server```directory and install the server dependencies:
```
cd ../server
npm install
```

Serve the app using ```node``` or [```nodemon```](https://github.com/remy/nodemon)
```
nodemon server.js
````

## Guide<a name="guide></a>

#### The Angular app <a name="angular"></a>

The angular app is served by a minimal express server and tries to be as independent of the express app as possible. Almost all requests are send directly to a CouchDB instance using PouchDB. Requests are handled by the ```angular-sofa``` module. This module contains two main factories:

- The ```Sync``` factory: Used to sync a local PouchDB database with a remote CouchDB database. This factory allows live updating.
- The ```Model``` factory: Used to interact with a remote CouchDB database as with a REST api.


#### CouchDB configuration <a name="couchdbconfig"></a>

The app tries to leverage the extra features of CouchDB as much as possible. This includes

- Views
- Security through validation documents
- Filters for filtered syncing to the local database


## Stack<a name="stack"></a>

We make use of the following technologies:

- [AngularJS](https://angularjs.com)
  - [angular-ui](http://angular-ui.github.io): Bootstrap UI elements and routing
  - [angular-form-for](https://github.com/bvaughn/angular-form-for): Easily produce forms and add validation
  - [angular-loading-bar](https://github.com/chieffancypants/angular-loading-bar): Automatically create a loading bar 
  - [angularjs-toaster](https://github.com/jirikavi/AngularJS-Toaster): Notification system
- [PouchDB](http://pouchdb.com): Couchdb client
  - [angular-sofa] Angular bindings
  - [pouchdb-authentication](https://github.com/nolanlawson/pouchdb-authentication): Easy authentication using pouchdb
- [CouchDB](http://couchdb.com): NoSQL database
  - [couchappy](http://couchappy.com) or [iriscouch](http://iriscouch.com) or [cloudant](http://cloudant.com): Online couchdb
  - fauxton to easily create/edit views
  - [chouchapp](https://github.com/mikeal/node.couchapp.js): Easily create/edit validation functions
- [Express](http://expressjs.com) to serve the app
- Build process
  - [Grunt](http://gruntjs.com)
  - [Bower](http://bower.io)


## Inspiration<a name="inspiration"></a>

This project is heavily inspired by

- [ngbp](https://github.com/ngbp/ngbp)
- [angular-client-side-auth](https://github.com/fnakstad/angular-client-side-auth)
- [angular-app](https://github.com/angular-app/angular-app)
