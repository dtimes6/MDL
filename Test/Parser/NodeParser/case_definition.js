var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.createTokenProvider(data);
    var node = parser.parseElementDecl();
    console.log(node);
});
