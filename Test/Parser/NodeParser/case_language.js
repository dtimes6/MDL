var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    console.log(parser.root.childs.stmts);
    console.log(parser.root.childs.stmts[0]);
});
