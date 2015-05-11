var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    // console.log(parser.root);
    parser.root.childs.stmts[4].resolve();
    console.log(parser.root.childs.stmts[4]);
    console.log("-------------");
    console.log(parser.root.childs.stmts[4].childs.type.childs.ref);
    console.log("-------------");
    console.log(parser.root.childs.stmts[4].childs.name);
    console.log("=============");
    parser.root.childs.stmts[5].resolve();
    console.log(parser.root.childs.stmts[5]);
    console.log("-------------");
    console.log(parser.root.childs.stmts[5].childs.name);
});