ng-pouch
========

Full stack angular app using pouchDB/couchDB to store data and handle security.

## Stack

We make use of the following technologies:

- [AngularJS](https://angularjs.com)
  - [angular-ui](http://angular-ui.github.io): Bootstrap UI elements and routing
  - [angular-form-for](https://github.com/bvaughn/angular-form-for): Easily produce forms and add validation
  - [angular-loading-bar](https://github.com/chieffancypants/angular-loading-bar): Automatically create a loading bar 
  - [angularjs-toaster](https://github.com/jirikavi/AngularJS-Toaster): Notification system
- [PouchDB](http://pouchdb.com): Couchdb client
  - [angular-pouchdb](https://github.com/angular-pouchdb/angular-pouchdb): Angular bindings
  - [pouchdb-authentication](https://github.com/nolanlawson/pouchdb-authentication): Easy authentication using pouchdb
- [CouchDB](http://couchdb.com): NoSQL database
  - [couchappy](http://couchappy.com) or [iriscouch](http://iriscouch.com) or [cloudant](http://cloudant.com): Online couchdb
  - fauxton to easily create/edit views
  - [chouchapp](https://github.com/mikeal/node.couchapp.js): Easily create/edit validation functions
- [Express](http://expressjs.com) to serve the app
- Build process
  - [Grunt](http://gruntjs.com)
  - [Bower](http://bower.io)


## Inspiration

This project is heavily inspired by

- [ngbp-auth](https://github.com/arnoutaertgeerts/ngbp-auth)
- [angular-client-side-auth](https://github.com/fnakstad/angular-client-side-auth)
- [angular-app](https://github.com/angular-app/angular-app)
