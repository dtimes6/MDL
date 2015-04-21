module.exports = function (parser) {
    'use strict';

    parser.prototype.parseForForIn = function () {
        var n = this.push();
        n.type = 'for_or_forin';
        n.createScope();
        this.require('for');
        this.consume();
        this.require('(');
        this.consume();
        var for_init = this.parseExprCanDecl();
        var token = this.getToken();
        if (token.text === 'in') {
            this.consume();
            n.type   = 'for_in';
            var for_var       = for_init;
            var for_initarray = this.parseExpr();
            n.childs = {
                variable:  for_var,
                initarray: for_initarray
            };
            n.method = this.method_buildin + 'statement_for_in';
        } else {
            n.type = 'for';
            this.require(';');
            this.consume();
            var for_cond = this.parseExpr();
            this.require(';');
            this.consume();
            var for_step = this.parseExpr();
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