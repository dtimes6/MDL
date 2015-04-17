var TokenProvider = require('../../Compiler/Parser/token.js').TokenProvider;
require('../../test.js')(__filename, function (data) {
    'use strict';
    var tokenProvider = new TokenProvider(data);
    try {
        tokenProvider.getToken();
    } catch (err) {
        console.log(err);
    }
});