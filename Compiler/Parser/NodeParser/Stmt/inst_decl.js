module.exports = function (parser) {
    'use strict';
    parser.prototype.parseInstDecl = function () {
        var n = this.push();
        n.type = 'inst_decl';

        var type = this.parseType();
        var name = this.parseNamedRef();

        n.childs = {
            type:  type,
            name:  name,
            init:  null
        };
        n.method = this.method_buildin + 'inst_decl';
        // register name in scope
        name.childs.ref = n;
        if (n.parent.scope) {
            n.parent.scope.symbol.push(name);
        } else {
            throw "Error: type decl must be in within a scope!";
        }
        return this.pop(n);
    };

    parser.prototype.parseInstDeclStmt = function () {
        var n = this.parseInstDecl();
        this.require(';');
        this.consume();
        return n;
    };

    parser.prototype.parseInstDeclWithAssign = function () {
        var n = this.parseInstDecl();
        var init_expr = null;
        var token = this.getToken();
        if (token.text === '=') {
            this.consume();
            init_expr = this.parseExpr();
            n.childs.init = init_expr;
            n.method = this.method_buildin + 'inst_decl_assign';
        }
        return n;
    };
};