var msg = require('../ErrorHandling/errorhandling.js');
module.exports = function (node) {
    'use strict';
    node.prototype.createScope = function () {
        this.scope = { symbol: {}, type: {} };
        return this;
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