/* globals jake: false, desc: false, fail: false, complete: false, task: false, directory: false, rm: false, cp: false, require:false */

(() => {
    'use strict';
    const semver = require('semver');
    const jshint = require('simplebuild-jshint');
    const karma = require('simplebuild-karma');
    const shell = require('shelljs');

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
        afterEach: false,
        require: false
    };

    const KARMA_CONFIG = 'karma.conf.js';
    const DIST_DIR = 'generated/dist';


    desc('Start Karma Server');
    task('karma', () => {
        process.stdout.write('\nStarting Karma Server\n');

        karma.start({
            configFile: KARMA_CONFIG
        }, complete, fail);
    }, {async: true});

    desc('Default task');
    task('default', ['version', 'lint', 'test'], () => {
        process.stdout.write('\nBUILD OK\n');
    });

    desc('Run a localhost server');
    task('run', ['build'], () => {
        console.log(DIST_DIR);
        jake.exec('./node_modules/http-server/bin/http-server ' + DIST_DIR, {interactive: true}, complete);
    }, {async: true});

    desc('Run tests');
    task('test', () => {
        process.stdout.write('\nRunning Javascript tests\n');

        karma.run({
            configFile: KARMA_CONFIG,
            expectedBrowsers: [
                'Chrome 68.0.3440 (Mac OS X 10.13.6)'
            ],
            strict: process.env.strict !== 'false'
        }, complete, fail);
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

    desc('Build dist directory');
    task('build', [DIST_DIR], () => {
        process.stdout.write('\nBuilding dist directory\n');

        shell.rm('-rf', DIST_DIR + '/*');

        shell.cp('./src/index.html', DIST_DIR);

        jake.exec(
            `node node_modules/browserify/bin/cmd.js ./src/app.js -o ${DIST_DIR}/bundle.js`,
            {interactive: true},
            complete
        );
    }, {async: true});

    desc('Erase all generated files');
    task('clean', () => {
        process.stdout.write('\nErasing generated files\n');

        shell.rm('-rf', 'generated');
    });

    directory(DIST_DIR);
})();