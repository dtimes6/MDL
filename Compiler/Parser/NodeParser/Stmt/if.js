module.exports = function (parser) {
    'use strict';
    parser.prototype.parseIf = function () {
        var n = this.push();
        n.type   = 'if';

        this.require('if');
        this.consume();
        var cond    = this.parseExprBrace();
        var if_then = this.parseBlockOrStmt();
        var if_else = null;
        var token = this.getToken();
        if (token.text === 'else') {
            this.consume();
            if_else = this.parseBlockOrStmt();
        }

        n.childs = {
            condition: cond,
            then_stmt: if_then,
            else_stmt: if_else
        };
        n.method = this.method_buildin + 'statement_if';

        return this.pop(n);
    };
};