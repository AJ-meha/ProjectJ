#!/usr/bin/env node

var fs = require('fs-extra'),
        path = require('path');


var rootDir = path.resolve(__dirname, '../');
var appDir = path.resolve(__dirname, './');
var source = path.resolve(appDir, 'www');
var destination = path.resolve(rootDir, 'release/admin');

if(!fs.existsSync(rootDir+'/release')){
    fs.ensureDirSync(rootDir+'/release');
}

fs.emptyDirSync(destination);
fs.copySync(source, destination);