var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);

    console.log('--------------------------------');
    for (var i in parser.root.childs.stmts) {
        console.log(parser.root.childs.stmts[i]);
    }
    console.log('--------------------------------');
    console.log(parser.root.childs.stmts[i].childs.stmt.childs.stmts[2]);

    console.log('--------------------------------');
    console.log(parser.root.childs.stmts[i].childs.stmt.childs.stmts[2].childs.params[0]);
    console.log('--------------------------------');
    console.log(parser.root.childs.stmts[i].childs.stmt.childs.stmts[2].childs.params[0].childs.type);
    console.log(parser.root.childs.stmts[i].childs.stmt.childs.stmts[2].childs.params[0].childs.type.childs.base);
    console.log(parser.root.childs.stmts[i].childs.stmt.childs.stmts[2].childs.params[0].childs.type.childs.params);
    console.log('--------------------------------');
    console.log(parser.root.childs.stmts[i].childs.stmt.childs.stmts[2].childs.stmt.childs);
});
