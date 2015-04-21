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
    this.method   = null; // for elaboration method/function should taken
    this.scope    = null; // information in this scope
};

ATPNode.prototype.createScope = function () {
    'use strict';
    this.scope = { symbol: [], type: [], method: [], operator: [] };
    return this;
};

ATPNode.prototype.scopeNode = function () {
    'use strict';
    if (this.scope) {
        return this;
    }
    return this.parent.scopeNode();
};

ATPNode.prototype.constantEval = function () {
    'use strict';
    ///TODO: not implemented!
};

module.exports = ATPNode;
