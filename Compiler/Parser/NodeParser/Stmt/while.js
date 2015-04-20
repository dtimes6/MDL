module.exports = function (parser) {
    'use strict';

    parser.prototype.parseWhile = function () {
        var n = this.push();

        this.require('while');
        this.consume();
        var cond = this.parseExprBrace();
        var tag  = this.parseTag();
        var stmt = this.parseBlockOrStmt();

        n.type   = 'while';
        n.childs = {
            tag:  tag,
            cond: cond,
            stmt: stmt
        };
        n.method = this.method_buildin + 'statement_while';

        return this.pop(n);
    };

    parser.prototype.parseDoWhile = function () {
        var n = this.push();

        this.require('do');
        this.consume();
        var stmt = this.parseBlockOrStmt();
        this.require('while');
        this.consume();
        var cond = this.parseExprBrace();
        var tag  = this.parseTag();
        this.require(';');
        this.consume();

        n.type   = 'do_while';
        n.childs = {
            tag:  tag,
            cond: cond,
            stmt: stmt
        };
        n.method = this.method_buildin + 'statement_do_while';

        return this.pop(n);
    };
};
