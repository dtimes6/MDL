var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    for (var i in parser.root.childs.stmts) {
        console.log(parser.root.childs.stmts[i]);
    }
    var stmts = parser.root.childs.stmts[0].childs.stmt.childs.stmts;
    for (var i in stmts) {
        console.log(stmts[i]);
    }
});
