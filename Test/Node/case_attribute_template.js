var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    parser.root.attributeBuild();
    console.log(parser.root);
    console.log('-----------------------------------------');
    for (var i in parser.root.childs.stmts) {
        var stmt = parser.root.childs.stmts[i];
        if (stmt.is('template')) {
            console.log(stmt);
            console.log('--');
        }
    }
    console.log('-----------------------------------------');
});
