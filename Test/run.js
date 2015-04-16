#!/usr/bin/env node
var fs = require("fs");

console.log("MDL Unit Test Begin ...\n");
var path = arguments[4];
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
                    exec("node " + file, function (err, stdout, stderr) {
                        if (err) {
                            console.log("Error calling '" + file + "'");
                        } else {
                            fs.readFile(file + ".cmp", 'utf-8', function (err, data) {
                                if (data !== (stderr + stdout)) {
                                    fs.writeFile(file + ".log", (stderr + stdout), 'utf-8', function (err) {
                                        console.log('Running ' + handle + ' ... '  + 'Failed!');
                                    });
                                } else {
                                    exec("rm " + file + ".log");
                                }
                            });
                        }
                    });
                }
            });
        });
    });
}

findAndTest(path);