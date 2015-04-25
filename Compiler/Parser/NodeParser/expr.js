var msg = require('../../ErrorHandling/errorhandling.js');
module.exports = function (parser) {
    'use strict';
    parser.prototype.parseExprIdxRange = function () {
        var n = this.push();
        n.type   = 'range';
        this.require('[');
        this.consume();
        var index = this.parseExpr();
        this.require(']');
        this.consume();

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
                    n0.type = 'func_call';
                    n0.childs = {
                        method: param,
                        params: this.parseExprBrace()
                    };
                    n0.method = this.method_buildin + 'func_call';
                    param = this.pop(n0);
                    token = this.getToken();
                } else if (token.text === '.') {
                    this.consume();
                    var n0 = this.push();
                    n0.type = 'member';
                    n0.childs.base = param;
                    n0.childs.member = this.parseExpr();
                    n0.method = this.method_buildin + "member";
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
        var params = [];
        var op = '';
        do {
            var token = this.getToken();
            if (token === null) {
                msg.error(this, "Bad Expr with operator: '" + op + "'");
            }
            if (token.text === ')' ||
                token.text === ']' ||
                token.text === ';') { break; }
            var param = null;
            if (token.text === '(') {
                param = this.parseExprBrace();
            } else if (token.type === 'identifier') {
                this.consume();
                param = this.lookupForSymbol(this.current, token.text);
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
                        msg.error(this, "invalid operands join together !");
                    }
                }
                op += '$';
            } else {
                op += token.text.replace(/\$/g, '\\$');
                this.consume();
            }
        } while (1);

        if (op === '$') {
            // has push but no pop
            return params[0];
        }
        var n = this.push();
        for (var i in params) {
            params[i].parent = n;
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
            (this.getToken(2).type === 'identifier' ||
             this.getToken(2).text === '::')) {
            return this.parseInstDeclWithAssign();
        }
        // expr
        return this.parseExpr();
    };

    parser.prototype.nullStmt = function () {
        var n = this.push();

        this.require(';');
        this.consume();

        n.type = 'null';
        return this.pop(n);
    };

    parser.prototype.parseExprStmt = function () {
        if (this.getToken().text === ';') {
            return this.nullStmt();
        }
        var n = this.parseExprCanDecl();
        this.require(';');
        this.consume();
        return n;
    };
};
