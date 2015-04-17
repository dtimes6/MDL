var TokenProvider = require('../../Compiler/Parser/token.js').TokenProvider;
require('../../test.js')(__filename, function (data) {
    'use strict';
    var tokenProvider = new TokenProvider(data);
    try {
        tokenProvider.require('function');
    } catch (err) {
        console.log(err);
    }
});