/**
 * Created by daipeng on 15/4/22.
 */
var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    for (var i in parser.root.childs.stmts) {
        console.log(parser.root.childs.stmts[i]);
    }
    console.log(parser.root.childs.stmts[0].childs.stmt.childs.stmts[1]);
});
