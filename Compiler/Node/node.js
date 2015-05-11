/***
 * @file:   node.js
 * @author: Peng Dai
 *
 * @brief： Abstract parse tree
 *
 * MDL
 *
 * Copyright (C) 2015, Peng Dai. All rights reserved!
 *
 ***/
var ATPNode = function () {
    'use strict';
    this.parent   = null;
    this.type     = null; // type of node tails how to visit childs
    this.childs   = {};
    this.value    = null; // for original constants, or reserved constants
    this.scope    = null; // information in this scope
};

ATPNode.Node = ATPNode;

require('./creation.js')(ATPNode);
require('./visitor.js')(ATPNode);
require('./NodeType/attributes.js')(ATPNode);
require('./Elaboration/expand.js')(ATPNode);
require('./Elaboration/resolve.js')(ATPNode);

ATPNode.same = function (l, r) {
    'use strict';
    var same = true;
    ATPNode.crossvisitor(l, r, { before: function (l, r) {
        if (l.type  != r.type)  { same = false; return true; }
        if (l.value != r.value) { same = false; return true; }
    }});
    return false;
};

ATPNode.prototype.size = function () {
    'use strict';
    var cache = [];
    ATPNode.visitor(this, {before: function (n) {
        cache.push(n);
    }});
    return cache.length;
};

ATPNode.prototype.scopeNode = function () {
    'use strict';
    if (this.scope) {
        return this;
    }
    return this.parent.scopeNode();
};

ATPNode.prototype.lookupType = function () {
    'use strict';
    if (this.type === 'symbol') {
        if (this.childs.base) {
            var r = this.childs.base.ref.scope.type[this.childs.name];
            if (r) {
                return r;
            }
            return null;
        } else {
            var n = this.scopeNode();
            while (n) {
                var r = n.scope.type[this.childs.name];
                if (r) {
                    return r;
                } else {
                    n = n.parent;
                    if (n) {
                        n = n.scopeNode();
                    }
                }
            }
            return null;
        }
    }
    return null;
};

ATPNode.prototype.lookupVariable = function () {
    'use strict';
    if (this.type === 'symbol') {
        if (this.childs.base) {
            var r = this.childs.base.childs.ref.scope.type[this.childs.name];
            if (r) {
                return r;
            }
            return null;
        } else {
            var n = this.scopeNode();
            while (n) {
                var r = n.scope.symbol[this.childs.name];
                if (r) {
                    return r;
                } else {
                    n = n.parent;
                    if (n) {
                        n = n.scopeNode();
                    }
                }
            }
            return null;
        }
    }
    if (this.type === 'member') {
        var r = this.childs.path.childs.ref.scope.symbol[this.childs.name];
        if (r) {
            return r;
        }
        return null;
    }
    return null;
};

module.exports = ATPNode;
