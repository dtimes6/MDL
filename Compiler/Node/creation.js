var msg = require('../ErrorHandling/errorhandling.js');
module.exports = function (node) {
    'use strict';
    node.prototype.appendChild = function (name, n) {
        this.childs[name] = n;
        n.parent = this;
    };

    node.prototype.createScope = function () {
        this.scope = { symbol: {}, type: {} };
        return this;
    };

    node.prototype.clone = function () {
        var cache = [];
        var current = this.parent;
        var index = 0;
        var clone = function (n) {
            if (n.clone_index !== undefined) {
                return cache[n.clone_index].clone;
            }
            var c = new node.Node();
            /// cache here just to avoid loop case.
            n.clone_index = index;
            cache.push({original: n, clone: c});

            c.parent = current;
            current = c;
            c.childs = node.reconstruct(n.childs, clone);
            if (n.scope) {
                c.scope = node.reconstruct(n.scope, clone);
            }
            c.type  = n.type;
            c.value = n.value;
            current = c.parent;
            return c;
        };
        var c = node.reconstruct(this, clone);
        for (var i in cache) {
            delete cache[i].original.clone_index;
        }
        return c;
    };

    node.prototype.addType = function (n) {
        if (n.parent &&
            n.parent.type === 'module_decl' &&
            n.parent.childs.tparams) {
            if (this.scope.type[n.value]) {
                this.scope.type[n.value].push(n);
            } else {
                this.scope.type[n.value] = [n];
            }
        } else {
            if (this.scope.type[n.value]) {
                msg.error(this, "redefine type:" + n.value);
            }
            this.scope.type[n.value] = n;
        }
    };

    node.prototype.addSymbol = function (n) {
        if (this.scope.symbol[n.value]) {
            msg.error(this, "Error: redefine symbol:" + n.value);
        }
        this.scope.symbol[n.value] = n;
    };

    node.prototype.addMethod = function (n) {
        if (this.scope.symbol[n.value]) {
            this.scope.symbol[n.value].push(n);
        } else {
            this.scope.symbol[n.value] = [n];
        }
    };

    node.prototype.addOperator = function (n) {
        if (this.scope.symbol[n.value]) {
            this.scope.symbol[n.value].push(n);
        } else {
            this.scope.symbol[n.value] = [n];
        }
    };
};