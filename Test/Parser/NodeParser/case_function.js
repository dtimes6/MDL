var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    for (var i in parser.root.childs.stmts) {
        console.log(parser.root.childs.stmts[i]);
    }
    console.log('----------------');
    console.log(parser.root.childs.stmts[2].childs.name);
    console.log('----------------');
    console.log(parser.root.childs.stmts[2].childs.type);
    console.log('----------------');
    console.log(parser.root.childs.stmts[3].childs.type);
});
