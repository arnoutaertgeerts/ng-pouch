/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */
    build_dir: 'build',
    compile_dir: 'bin',

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app_files: {
        js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
        jsunit: [ 'src/**/*.spec.js' ],

        coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
        coffeeunit: [ 'src/**/*.spec.coffee' ],

        atpl: [ 'src/app/**/*.tpl.html' ],
        ctpl: [ 'src/common/**/*.tpl.html' ],

        html: [ 'src/index.html' ],
        less: 'src/less/main.less'
    },

    /**
     * This is a collection of files used during testing only.
     */
    test_files: {
        js: [
            'vendor/angular-mocks/angular-mocks.js'
        ]
    },

    /**
     * This is the same as `app_files`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     */
    vendor_files: {
        js: [
            //External plugins
            'vendor/pace/pace.min.js',
            'vendor/underscore/underscore-min.js',
            //PouchDB plugins
            'vendor/pouchdb-authentication/dist/pouchdb.authentication.min.js',
            'vendor/delta-pouch/dist/pouchdb.delta-pouch.js',
            //Angular plugins
            'vendor/angular/angular.js',
            'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'vendor/angular-ui-router/release/angular-ui-router.js',
            'vendor/angular-ui-utils/modules/route/route.js',
            'vendor/angular-cookies/angular-cookies.min.js',
            'vendor/angular-form-for/dist/form-for.min.js',
            'vendor/angular-pouchdb/angular-pouchdb.js',
            'vendor/factoryng/dist/factoryng.js',
            'vendor/factoryng/dist/adapters/pouchyng.js',
            'vendor/angular-sanitize/angular-sanitize.min.js',
            'vendor/trNgGrid/release/trNgGrid.min.js',
            'vendor/angular-animate/angular-animate.min.js',
            'vendor/angularjs-toaster/toaster.js',
            'vendor/angular-loading-bar/build/loading-bar.min.js',
        ],
        css: [
            'vendor/angular-loading-bar/build/loading-bar.min.css',
            'vendor/angular-form-for/dist/form-for.css',
            'vendor/trNgGrid/release/trNgGrid.min.css',
            'vendor/angularjs-toaster/toaster.css'
        ],
        assets: [
        ]
    },
};
