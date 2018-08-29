/* globals desc: false, fail: false, complete: false, task: false */
(() => {
    'use strict';
    const semver = require('semver');
    const jshint = require('simplebuild-jshint');

    desc('Default task');
    task('default', ['version', 'lint'], () => {
        process.stdout.write('\nBUILD OK\n');
    });

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
    process.stdout.write('\nLinting Javascript code\n');
    task('lint', () => {
        jshint.checkFiles({
            files: 'Jakefile.js',
            options: {
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
            }
        }, complete, fail);
    }, {async: true});

})();