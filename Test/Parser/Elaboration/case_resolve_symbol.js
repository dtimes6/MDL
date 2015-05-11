var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    var log = function (str) {
        console.log("--------------------------------");
        console.log(str);
        console.log("--------------------------------");
        console.log(parser.root.childs.stmts[1].childs.type);
        console.log(parser.root.childs.stmts[1].childs.type.childs.ref);
        console.log(parser.root.childs.stmts[3].childs.init);
        console.log(parser.root.childs.stmts[3].childs.init.childs.params[0]);
    };
    log('before-elab:');
    parser.root.resolve();
    log('after-elab:');
});