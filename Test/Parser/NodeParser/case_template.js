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
    var tparam = parser.root.childs.stmts[i].childs.tparams;
    for (var i in tparam) {
        console.log(tparam[i]);
    }
    console.log('--------------------------------');
    console.log(tparam[i].childs.name);
    console.log('--------------------------------');
    console.log(parser.root.scope.symbol.add[0].childs.ref.childs.tparams[0]);
});
