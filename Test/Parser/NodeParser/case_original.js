var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.createTokenProvider(data);
    var node = parser.parseNamedRef();
    console.log(node);
    node = parser.parseNumber();
    console.log(node);
    node = parser.parseString();
    console.log(node);
});