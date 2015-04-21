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
var ATPNode = require('./node.js');

var ATPParser = function () {
    'use strict';
    this.tokenProvider = null;
    var n = new ATPNode().createScope();
    n.type   = 'root';
    n.childs = {
        stmts: []
    };
    this.root = n;

    this.root.scope.type.push(ATPParser.typeOriginal());
    this.root.scope.type.push(ATPParser.typeSynth());
    this.root.scope.type.push(ATPParser.typeMethod());
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
require("./NodeParser/decl.js")(ATPParser);
require("./NodeParser/expr.js")(ATPParser);
require("./NodeParser/stmt.js")(ATPParser);

ATPParser.debug = true;

ATPParser.prototype.parse = function (buffer) {
    'use strict';
    this.createTokenProvider(buffer);
    while (this.getToken() !== null) {
        if (ATPParser.debug) {
            var stmt = this.parseStmt();
            if (stmt === undefined) {
                break;
            }
            this.root.childs.stmts.push(stmt);
        } else {
            try {
                var stmt = this.parseStmt();
                if (stmt === undefined) {
                    break;
                }
                this.root.childs.stmts.push(stmt);
            } catch (err) {
                console.error(err);
                return 0;
            }
        }
    }
    return 1;
};

ATPParser.prototype.lookupForType = function (n, name) {
    'use strict';
    n = n.parent.scopeNode();
    for (var t in n.scope.type) {
        var type = n.scope.type[t];
        if (type.childs.name) {
            if (type.childs.name.value === name) {
                return type;
            }
        }
    }
    if (n.parent) {
        return this.lookupForType(n, name);
    } else {
        throw "Error: '" + name + "' is not a name of a type!";
    }
};

ATPParser.prototype.lookupForSymbol = function (n, name) {
    'use strict';
    n = n.parent.scopeNode();
    for (var t in n.scope.symbol) {
        var sym = n.scope.symbol[t];
        if (sym.value === name) {
            return sym;
        }
    }
    if (n.parent) {
        return this.lookupForSymbol(n, name);
    } else {
        throw "Error: '" + name + "' is not a name of a symbol!";
    }
};

module.exports = ATPParser;