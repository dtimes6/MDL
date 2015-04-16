#!/usr/bin/env istanbul cover
var fs = require("fs");

console.log("MDL Unit Test Begin ...\n");

function findAndTest(path) {
    'use strict';
    fs.readdir(path, function (err, files) {
        files.forEach(function (handle) {
            var file = path + '/' + handle;
            fs.stat(file, function(err, stat) {
                if (stat.isDirectory()) {
                    findAndTest(file);
                } else if (handle.match(/^case_[^\.]*\.js$/)){
                    var exec = require('child_process').exec;
                    require(file);
                }
            });
        });
    });
}

findAndTest('.');