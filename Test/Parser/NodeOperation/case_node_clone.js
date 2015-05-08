var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    var clone = parser.root.clone();
    console.log(clone);
    console.log(parser.root);
    console.log("------------------------");
    for (var i in clone.childs.stmts) {
        console.log(clone.childs.stmts[i]);
    }
});