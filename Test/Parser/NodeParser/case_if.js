var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    for (var i in parser.root.childs.stmts) {
        console.log(parser.root.childs.stmts[i]);
    }
    console.log("-----------------------------------------------------------");
    console.log(parser.root.childs.stmts[0].childs.stmt.childs.stmts[0]);
    console.log(parser.root.childs.stmts[0].childs.stmt.childs.stmts[0].childs.condition);
    console.log(parser.root.childs.stmts[0].childs.stmt.childs.stmts[0].childs.then_stmt.childs.stmts[0].childs.expr);
});
