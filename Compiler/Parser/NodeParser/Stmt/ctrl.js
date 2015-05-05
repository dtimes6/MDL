var msg = require('../../../ErrorHandling/errorhandling.js');

module.exports = function (parser) {
    'use strict';
    parser.prototype.parseReturn = function () {
        var n = this.push();
        n.type   = 'return';

        this.require('return');
        this.consume();
        var token = this.getToken();

        var expr = null;
        if (token.text !== ';') {
            expr = this.parseExpr();
        }
        this.require(';');
        this.consume();

        var scope = null;
        var p = n.parent;
        while (p) {
            if (p.type === 'function_decl' ||
                p.type === 'process_decl'  ||
                p.type === 'operation_decl'||
                p.type === 'operproc_decl') {
                scope = p;
                break;
            }
            if (p.type === 'module_decl' ||
                p.type === 'template_decl') {
                msg.error(this, "return statement must be in the scope of a function");
            }
            p = p.parent;
        }
        if (scope === null) {
            msg.error(this, "return statement must be in the scope of a function");
        }

        n.childs = {
            expr:  expr,
            scope: scope
        };
        return this.pop(n);
    };

    parser.prototype.parseBreak = function () {
        var n = this.push();
        n.type = 'break';

        this.require('break');
        this.consume();
        var tag = null;
        if (this.getToken().text !== ';') {
            tag = this.parseNamedRef();
        }
        this.require(';');
        this.consume();

        n.childs = {
            tag: tag
        };
        return this.pop(n);
    };

    parser.prototype.parseContinue = function () {
        var n = this.push();
        n.type = 'continue';

        this.require('continue');
        this.consume();
        var tag = null;
        if (this.getToken().text !== ';') {
            tag = this.parseNamedRef();
        }
        this.require(';');
        this.consume();

        n.childs = {
            tag: tag
        };
        return this.pop(n);
    };

    parser.prototype.parseTag = function () {
        var token = this.getToken();
        if (token.text !== ':') {
            return null;
        }
        this.consume();
        var n = this.push();

        n.type   = 'tag';
        n.childs = {
            name: this.parseNamedRef()
        };
        n.childs.name.childs.ref = n;
        return this.pop(n);
    };
};
