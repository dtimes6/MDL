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
            if (p.type === 'function_decl') {
                scope = p;
            }
            if (p.type === 'module_decl' ||
                p.type === 'template_decl') {
                throw "Error: return statement must be in the scope of a function";
            }
            p = p.parent;
        }
        if (scope === null) {
            throw "Error: return statement must be in the scope of a function";
        }

        n.childs = {
            expr:  expr,
            scope: scope
        };
        n.method = this.method_buildin + 'return';

        return this.pop(n);
    };

    parser.prototype.parseBreak = function () {
        var n = this.push();
        n.type = 'break';

        this.require('break');
        this.consume();
        var tag   = this.parseNamedRef();
        this.require(';');
        this.consume();

        n.childs = {
            tag: tag
        };
        n.method = this.method_buildin + 'break';

        return this.pop(n);
    };

    parser.prototype.parseContinue = function () {
        var n = this.push();
        n.type = 'continue';

        this.require('continue');
        this.consume();
        var tag   = this.parseNamedRef();
        this.require(';');
        this.consume();

        n.childs = {
            tag: tag
        };
        n.method = this.method_buildin + 'continue';

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
        n.method = this.method_buildin + 'tag';

        return this.pop(n);
    };
};
