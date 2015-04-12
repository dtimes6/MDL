var TokenProvider = require('../../Compiler/Parser/token.js').TokenProvider;
var fs = require('fs');

var file = 'case_tokenprovider.mdl';
fs.readFile(file, 'utf-8', function (err, data) {
    'use strict';
    if (err) {
        console.log('Missing File: ' + file);
    } else {
        var tokenProvider = new TokenProvider(data);
        var token = tokenProvider.require("function");
        tokenProvider.consume(1);
        console.log(token);
        var func_name = tokenProvider.requireType('identifier');
        console.log(func_name);
        tokenProvider.consume(1);
        var open0 = tokenProvider.require('()');
        tokenProvider.consume(1);
        var sep   = tokenProvider.require(':');
        tokenProvider.consume(1);
        var type  = tokenProvider.requireType('identifier');
        console.log(type);
        tokenProvider.consume(1);
        var open1 = tokenProvider.require('{');
        tokenProvider.consume(1);
        var close1 = tokenProvider.require('return');
        tokenProvider.consume(1);
        var token = tokenProvider.getToken();
        console.log(token);
        tokenProvider.consume(1);
        var token = tokenProvider.getToken();
        console.log(token);
        tokenProvider.consume(1);
        var token = tokenProvider.getToken();
        console.log(token);
        tokenProvider.consume(1);
        var token = tokenProvider.getToken();
        console.log(token);
    }
});
