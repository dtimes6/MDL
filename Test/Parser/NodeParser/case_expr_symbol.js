var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    console.log(parser.root.scope);
    console.log(parser.root.scope.type["net8"]);
    console.log(parser.root.childs.stmts);
    console.log(parser.root.childs.stmts[3].childs.init);
    console.log(parser.root.childs.stmts[3].childs.init.childs.params);
    console.log(parser.root.childs.stmts[3].childs.init.childs.params[0]);
});
