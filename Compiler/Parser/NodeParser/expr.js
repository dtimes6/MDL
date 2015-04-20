module.exports = function (parser) {
    'use strict';
    parser.prototype.parseExprIdxRange = function () {
        var n = this.push();
        this.require('[');
        this.consume();
        var index = this.parseExpr();
        this.require(']');
        this.consume();

        n.type   = 'range';
        n.childs = {
            base:  null,
            index: index
        };
        n.method = this.method_buildin + 'range';

        return this.pop(n);
    };

    parser.prototype.parseExprBrace = function () {
        this.require('(');
        this.consume();
        var n = this.parseExpr();
        this.require(')');
        this.consume();
        return n;
    };

    parser.prototype.parseFuncCallOrIndex = function (param) {
        if (param) {
            var token = this.getToken();
            while (1) {
                if (token.text === '[') {
                    var n0 = this.parseExprIdxRange();
                    n0.childs.base = param;
                    n0.type = 'index';
                    n0.method = this.method_buildin + 'index';
                    param = n0;
                    token = this.getToken();
                } else if (token.text === '(') {
                    var n0 = this.push();
                    n0.childs = {
                        method: param,
                        params: this.parseExprBrace()
                    };
                    n0.type = 'function';
                    n0.method = this.method_buildin + 'function';
                    param = this.pop(n0);
                    token = this.getToken();
                } else {
                    break;
                }
            }
        }
        return param;
    };

    parser.prototype.parseExpr = function () {
        var n = this.push();
        var params = [];
        var op = '';
        do {
            var token = this.getToken();
            if (token === null) {
                throw "Error: Bad Expr!";
            }
            if (token.text === ')' ||
                token.text === ']' ||
                token.text === ';') { break; }
            var param = null;
            if (token.text === '(') {
                param = this.parseExprBrace();
            } else if (token.type === 'identifier') {
                this.consume();
                param = this.lookupForSymbol(n, token.text);
            } else if (token.isNumber()) {
                param = this.parseNumber();
            } else if (token.isString()) {
                param = this.parseString();
            }
            param = this.parseFuncCallOrIndex(param);
            if (param) {
                params.push(param);
                if (op[op.length - 1] === '$') {
                    if (op[op.length - 2] !== '\\') {
                        throw "Error: invalid operands join together !";
                    }
                }
                op += '$';
            } else {
                op += token.text.replace(/\$/g, '\\$');
                this.consume();
            }
        } while (1);

        if (op === '') {
            return params[0];
        }
        n.type   = 'operation';
        n.method = op;
        n.childs = {
            op:     op,
            params: params
        };

        return this.pop(n);
    };

    parser.prototype.parseExprCanDecl = function () {
        // instance
        if (this.getToken().type === 'identifier' &&
            this.getToken(2).type === 'identifier') {
            return this.parseInstDeclWithAssign();
        }
        // expr
        return this.parseExpr();
    };

    parser.prototype.parseExprStmt = function () {
        var n = this.parseExprCanDecl();
        this.require(';');
        this.consume();
        return n;
    };
};
