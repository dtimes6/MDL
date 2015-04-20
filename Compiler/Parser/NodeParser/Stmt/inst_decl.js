module.exports = function (parser) {
    'use strict';
    parser.prototype.parseInstDecl = function () {
        var n = this.push();

        var token = this.requireType('identifier');
        this.consume();
        var type = this.lookupForType(n, token.text);
        var name = this.parseNamedRef();
        token = this.getToken();
        var range = [];
        while (token.text === '[') {
            this.consume();
            var left = this.parseExpr();
            var right = this.zeroValueExpr();
            token = this.getToken();
            if (token.text === ':') {
                this.consume();
                right = this.parseExpr();
            }
            this.require(']');
            range.push({left: left, right: right});
            token = this.getToken();
        }
        n.type = 'inst_decl';
        n.childs = {
            base:  type,
            range: range,
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