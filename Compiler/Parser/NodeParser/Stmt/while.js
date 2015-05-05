module.exports = function (parser) {
    'use strict';

    parser.prototype.parseWhile = function () {
        var n = this.push();
        n.type   = 'while';

        this.require('while');
        this.consume();
        var cond = this.parseExprBrace();
        var tag  = this.parseTag();
        var stmt = this.parseBlockOrStmt();

        n.childs = {
            tag:  tag,
            cond: cond,
            stmt: stmt
        };

        return this.pop(n);
    };

    parser.prototype.parseDoWhile = function () {
        var n = this.push();
        n.type   = 'do_while';

        this.require('do');
        this.consume();
        var stmt = this.parseBlockOrStmt();
        this.require('while');
        this.consume();
        var cond = this.parseExprBrace();
        var tag  = this.parseTag();
        this.require(';');
        this.consume();

        n.childs = {
            tag:  tag,
            cond: cond,
            stmt: stmt
        };

        return this.pop(n);
    };
};
