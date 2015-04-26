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
    console.log(parser.root.childs.stmts[i].childs.tparams[0]);
    console.log(parser.root.childs.stmts[i].childs.tparams[1]);
    console.log('--------------------------------');
    console.log(parser.root.childs.stmts[i].childs.tparams[1].childs.type);
});
