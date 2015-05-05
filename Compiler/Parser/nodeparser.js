/***
 * @file:   nodeparser.js
 * @author: Peng Dai
 *
 * @brief： Abstract parse tree
 *
 * MDL
 *
 * Copyright (C) 2015, Peng Dai. All rights reserved!
 *
 ***/
var msg = require('../ErrorHandling/errorhandling.js');
var ATPNode = require('./../Node/node.js');

var ATPParser = function () {
    'use strict';
    this.tokenProvider = null;
    var n = new ATPNode().createScope();
    n.type   = 'root';
    n.childs = {
        stmts: []
    };
    this.root = n;

    this.root.addType(ATPParser.typeOriginal());
    this.root.addType(ATPParser.typeSynth());
    this.root.addType(ATPParser.typeMethod());
    this.method_buildin = "method_buildin_";

    this.current = this.root;
};
ATPParser.Node = ATPNode;

// Parser related
ATPParser.prototype.push = function () {
    'use strict';
    var n = new ATPNode();
    n.parent = this.current;
    this.current = n;
    return n;
};

ATPParser.prototype.pop = function (n) {
    'use strict';
    this.current = n.parent;
    return n;
};

require("./NodeParser/token.js")(ATPParser);
require("./NodeParser/buildin")(ATPParser);
require("./NodeParser/original.js")(ATPParser);
require("./NodeParser/Stmt/module.js")(ATPParser);
require("./NodeParser/expr.js")(ATPParser);
require("./NodeParser/stmt.js")(ATPParser);

ATPParser.prototype.parse = function (buffer) {
    'use strict';
    buffer += "\n"; // avoid eof issue
    this.createTokenProvider(buffer);
    while (this.getToken() !== null) {
        try {
            var stmt = this.parseStmt();
            if (stmt === undefined) {
                break;
            }
            this.root.childs.stmts.push(stmt);
        } catch (err) {
            if (msg.debug) { throw err; }
            console.error(err);
            return 0;
        }
    }
    return 1;
};

module.exports = ATPParser;