module.exports = function (file, func) {
    'use strict';
    file = file.substr(0, file.length - 2) + "mdl";
    var fs = require('fs');
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            console.log('Missing File: ' + file);
        } else {
            func(data);
        }
    });
};
