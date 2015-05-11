var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.parse(data);
    var log = function (str) {
        console.log("--------------------------------");
        console.log(str);
        console.log("--------------------------------");
        console.log(parser.root.childs.stmts);
        var func_client = parser.root.childs.stmts[6].childs.ref;
        console.log(func_client);
        if (func_client) {
            var func_timeout = func_client.childs.stmt.childs.stmts[1].childs.ref;
            console.log(func_timeout);
            var if_clk = func_timeout.childs.stmt.childs.stmts[1];
            var if_ack = if_clk.childs.then_stmt.childs.stmts[0];
            var if_req_aa_nack = if_ack.childs.else_stmt;
            console.log(if_req_aa_nack.childs.condition.childs.params[0]);
            console.log(if_req_aa_nack.childs.condition.childs.params[1].childs.params[0]);
        }
    };
    log('before-elab:');
    parser.root.resolve();
    log('after-elab:');
});