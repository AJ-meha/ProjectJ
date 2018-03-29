#!/usr/bin/env node

var fs = require('fs-extra'),
        path = require('path'),
        cheerio = require('cheerio'),
        revHash = require('rev-hash');

/**
 *
 * @param string fileName
 * @returns string
 */
function hashFile(file) {

    // Get file name
    var fileName = file.replace(/\.[^/.]+$/, "");
    // Get file extension
    var re = /(?:\.([^.]+))?$/;
    var fileExtension = re.exec(file)[1];

    var filePath = path.join(buildDir, file);
    var fileHash = revHash(fs.readFileSync(filePath));
    var fileNewName = `${fileName}.${fileHash}.${fileExtension}`;
    var fileNewPath = path.join(buildDir, fileNewName);
    var fileNewRelativePath = path.join('build', fileNewName);
    //Rename file
    console.log("cache-busting.js:hashFile:Renaming " + filePath + " to " + fileNewPath);
    fs.renameSync(filePath, fileNewPath);

    var serviceWorkerData = fs.readFileSync(serviceWorkerPath, 'utf8');    
    var serviceWorkerModifiedData = serviceWorkerData.replace(file, fileNewName);
    fs.writeFileSync(serviceWorkerPath, serviceWorkerModifiedData, 'utf8');

    return fileNewRelativePath;
}



var rootDir = path.resolve(__dirname, '../');
var appDir = path.resolve(__dirname, './');
var source = path.resolve(appDir, 'www');
var destination = path.resolve(rootDir, 'release');

var buildDir = path.join(source, 'build');
var indexPath = path.join(source, 'index.html');
var serviceWorkerPath = path.join(source, 'service-worker.js');
$ = cheerio.load(fs.readFileSync(indexPath, 'utf-8'));


$('head link[href="build/main.css"]').attr('href', hashFile('main.css'));
$('body script[src="build/main.js"]').attr('src', hashFile('main.js'));
$('body script[src="build/polyfills.js"]').attr('src', hashFile('polyfills.js'));
$('body script[src="build/vendor.js"]').attr('src', hashFile('vendor.js'));

fs.writeFileSync(indexPath, $.html());


if(!fs.existsSync(destination)){
    fs.ensureDirSync(rootDir+'/release');
}


var adminBuildExists = fs.existsSync(destination+'/admin');

if(adminBuildExists){
    fs.ensureDirSync(source+'/admin');
    fs.copySync(destination+'/admin', source+'/admin');
}

fs.emptyDirSync(destination);
fs.copySync(source,destination);

if(adminBuildExists){
    fs.moveSync(source+'/admin', destination+'/admin', { overwrite: true });
}