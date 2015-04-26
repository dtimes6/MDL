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
    console.log(parser.root.childs.stmts[i].childs.stmt.childs.stmts[2].childs.method[2]);
    console.log('--------------------------------');
    console.log(parser.root.childs.stmts[i].childs.stmt.childs.stmts[2].childs.tparams_specification.childs.map.type);
    console.log('--------------------------------');
    console.log(parser.root.childs.stmts[i].childs.stmt.childs.stmts[2].childs.tparams_specification.childs.map.type.childs.base);
    console.log(parser.root.childs.stmts[i].childs.stmt.childs.stmts[2].childs.tparams_specification.childs.map.type.childs.tparams_specification.childs.map.type);
});
