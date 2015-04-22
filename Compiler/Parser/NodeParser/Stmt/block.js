module.exports = function (parser) {
    'use strict';
    parser.prototype.parseBlock = function (env) {
        var n = this.push();
        if (env && env.scope) {
            n.scope = env.scope;
        } else {
            n.createScope();
        }
        n.type   = 'block';

        this.require('{');
        this.consume();
        var stmts = [];
        while (this.getToken().text !== '}') {
            stmts.push(this.parseStmt());
        }
        this.consume();
        n.childs = {
            stmts: stmts
        };
        n.method = this.method_buildin + 'statement_block';

        return this.pop(n);
    };

    parser.prototype.parseBlockOrStmt = function() {
        var token = this.getToken();
        if (token.text === '{') {
            return this.parseBlock();
        }
        return this.parseStmt();
    };
};