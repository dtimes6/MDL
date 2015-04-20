module.exports = function (parser) {
    'use strict';

    parser.prototype.parseForForIn = function () {
        var n = this.push();
        n.createScope();
        this.require('for');
        this.consume();
        this.require('(');
        this.consume();
        var for_init = this.parseExprCanDecl();
        var token = this.getToken();
        if (token.text === 'in') {
            this.consume();
            var for_var       = for_init;
            var for_initarray = this.parseExpr();
            n.type   = 'for_in';
            n.childs = {
                variable:  for_var,
                initarray: for_initarray
            };
            n.method = this.method_buildin + 'statement_for_in';
        } else {
            this.require(';');
            this.consume();
            var for_cond = this.parseExpr();
            this.require(';');
            this.consume();
            var for_step = this.parseExpr();
            n.type = 'for';
            n.childs = {
                init: for_init,
                cond: for_cond,
                step: for_step
            };
            n.method = this.method_buildin + 'statement_for';
        }
        this.require(')');
        this.consume();
        n.childs.tag  = this.parseTag();
        n.childs.stmt = this.parseBlockOrStmt();

        return this.pop(n);
    };
}