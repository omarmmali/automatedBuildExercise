/* globals jake: false, desc: false, fail: false, complete: false, task: false */

(() => {
    'use strict';
    const semver = require('semver');
    const jshint = require('simplebuild-jshint');

    const lintOptions = {
        curly: true,
        eqeqeq: true,
        esversion: 6,
        forin: false,
        freeze: true,
        futurehostile: true,
        latedef: 'nofunc',
        noarg: true,
        nocomma: true,
        nonbsp: true,
        nonew: true,
        strict: true,
        undef: true,

        node: true,
        browser: true
    };

    const globals = {
        //mocha
        describe: false,
        it: false,
        before: false,
        after: false,
        beforeEach: false,
        afterEach: false
    };

    desc('Default task');
    task('default', ['version', 'lint'], () => {
        process.stdout.write('\nBUILD OK\n');
    });

    desc('Run a localhost server');
    task('run', () => {
        jake.exec('node ./node_modules/http-server/bin/http-server src', {interactive: true}, complete);
    }, {async: true});

    desc('Check Node version');
    task('version', () => {
        process.stdout.write('\nChecking Node version\n');
        const expectedNodeVersion = require('./package').engines.node;

        const actualVersion = process.version;
        if (semver.neq(actualVersion, expectedNodeVersion)) {
            fail('Node version mismatch!\nExpected: ' + expectedNodeVersion + '\nFound: ' + actualVersion);
        }
    });

    desc('Lint Javascript Code');
    task('lint', () => {
        process.stdout.write('\nLinting Javascript code\n');

        jshint.checkFiles({
            files: ['Jakefile.js', 'src/**/*.js'],
            options: lintOptions,
            globals: globals
        }, complete, fail);
    }, {async: true});

})();