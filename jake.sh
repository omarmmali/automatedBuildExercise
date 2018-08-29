#!/bin/sh

[ ! -f node_modules/.bin/jake ] && echo "Building NPM Modules:" && npm rebuild

node_modules/.bin/jake $*