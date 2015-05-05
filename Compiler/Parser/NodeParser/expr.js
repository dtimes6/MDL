var msg = require('../../ErrorHandling/errorhandling.js');
module.exports = function (parser) {
    'use strict';
    require('./Expr/symbol.js')(parser);
    parser.prototype.parseExprBrace = function () {
        this.require('(');
        this.consume();
        var n = this.parseExpr();
        this.require(')');
        this.consume();
        return n;
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
                param = this.parseSymbol();
                //this.consume();
                //param = this.lookupForSymbol(this.current, token.text);
            } else if (token.isNumber()) {
                param = this.parseNumber();
            } else if (token.isString()) {
                param = this.parseString();
            }
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
        if (this.getToken().type === 'identifier') {
            var clone = this.clone();
            clone.parseSymbol();
            if (clone.getToken().type === 'identifier') {
                return this.parseInstDeclWithAssign();
            }
        }
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
