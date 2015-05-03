var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.createTokenProvider(data);
    parser.parseStmt();
    var clone = parser.clone(parser.tokenProvider.pos);
    console.log(clone.parseStmt());
});