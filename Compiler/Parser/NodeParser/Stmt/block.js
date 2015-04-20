module.exports = function (parser) {
    'use strict';
    parser.prototype.parseBlock = function () {
        var n = this.push();
        n.createScope();
        this.require('{');
        this.consume();
        var stmts = [];
        while (this.getToken().text !== '}') {
            stmts.push(this.parseStmt());
        }
        this.consume();
        n.type   = 'block';
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