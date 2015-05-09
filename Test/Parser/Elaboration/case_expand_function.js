var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    var template = parser.root.childs.stmts[2];
    var expand = template.templateExpanding([parser.root.childs.stmts[0], parser.root.childs.stmts[1]]);

    console.log(template.scope.type['BUS']);
    console.log(template.scope.type['BUS'].childs.ref);
    console.log(template.scope.symbol['N'].childs.ref);
    console.log("----------------------------------");
    console.log(expand.scope.type['BUS']);
    console.log(expand.scope.type['BUS'].childs.ref);
    console.log(expand.scope.symbol['N'].childs.ref);
});
