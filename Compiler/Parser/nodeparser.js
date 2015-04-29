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

ATPParser.prototype.lookupScopeForType = function (n, name, i) {
    'use strict';
    if (i + 1 === name.length) {
        return n;
    }
    var type = n.childs.ref.scope.type[name[i + 1]];
    if (type) {
        return this.lookupScopeForType(type, name, i + 1);
    }
    msg.error(this, "'" + name.join('::') + "' is not a name of a type!");
};

ATPParser.prototype.lookupForType = function (n, name) {
    'use strict';
    n = n.parent.scopeNode();
    var type = n.scope.type[name[0]];
    if (type) {
        return this.lookupScopeForType(type, name, 0);
    }
    if (n.parent) {
        return this.lookupForType(n, name);
    } else {
        msg.error(this, "'" + name.join('::') + "' is not a name of a type!");
    }
};

ATPParser.prototype.createMemberRef = function (base, name) {
    var n = this.push();
    n.type  = 'member_identifier';
    n.value = name;
    n.childs = {
        base: base,
        ref:  null
    };
    n.method = this.method_buildin + 'member_identifier';
    return this.pop(n);
};

ATPParser.prototype.lookupForSymbol = function (n, name) {
    'use strict';
    if (n.type === 'member') {
        return this.createMemberRef(n.childs.base, name);
    }
    n = n.scopeNode();
    var sym = n.scope.symbol[name];
    if (sym) {
        return sym;
    }
    if (n.parent) {
        return this.lookupForSymbol(n.parent, name);
    } else {
        msg.error(this, "'" + name + "' is not a name of a symbol!");
    }
};

module.exports = ATPParser;