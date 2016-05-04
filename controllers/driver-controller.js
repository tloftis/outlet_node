'use strict';


function rationalizePaths(array){
    for(var i = 0, len = array.length; i < len; i++){
        //I know, this is very unneeded, but I like having it because of it's over bearing round-a-boutness
        array[i] = require.resolve(array[i]).split('\\').filter((o,i,a)=>{ return (a.length-1) !== i; }).join('\\');
    }

    return array;
}

var master = require('../config.js'),
    extend = require('util')._extend,
    glob = require('glob'),
    outputDriverLocs = rationalizePaths(glob.sync('../drivers/outputs/*/index.js', { cwd: __dirname })),
    inputDriverLocs = rationalizePaths(glob.sync('../drivers/inputs/*/index.js', { cwd: __dirname }));

var outputDrivers = [],
    inputDrivers = [],
    outputDriversHash = {},
    inputDriversHash = {};

function updateInputDrivers(){
    var driver,
        config;
    inputDrivers = [];
    inputDriversHash = {};

    for(var i = 0; i < inputDriverLocs.length; i++){
        driver = require(inputDriverLocs[i]);
        config = require(inputDriverLocs[i] + '/config.json');

        if(!config.id){
            config.id = master.genId();
            master.writeConfig(inputDriverLocs[i] + '/config.json', config);
        }

        extend(driver, config);
        inputDrivers.push(driver);
        inputDriversHash[driver.id] = driver;
    }
}

function updateOutputDrivers(){
    var driver,
        config;
    outputDrivers = [];
    outputDriversHash = {};

    for(var i = 0; i < outputDriverLocs.length; i++){
        driver = require(outputDriverLocs[i]);
        config = require(outputDriverLocs[i] + '/config.json');

        if(!config.id){
            config.id = master.genId();
            master.writeConfig(outputDriverLocs[i] + '/config.json', config);
        }

        extend(driver, config);
        outputDrivers.push(driver);
        outputDriversHash[driver.id] = driver;
    }
}

updateOutputDrivers();
updateInputDrivers();

exports.getOutputDrivers = function(id){
    return outputDrivers;
};

exports.getInputDrivers = function(id){
    return inputDrivers;
};

exports.getOutputDriver = function(id){
    return outputDriversHash[id];
};

exports.getInputDriver = function(id){
    return inputDriversHash[id];
};

return exports;