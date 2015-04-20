module.exports = function (parser) {
    'use strict';
    parser.prototype.parseDefault = function () {
        var n = this.push();

        this.require('default');
        this.consume();
        this.require(':');
        this.consume();
        var case_stmt = this.parseBlockOrStmt();

        n.type   = 'case_default';
        n.childs = {
            case_stmt: case_stmt
        };

        return this.pop(n);
    };

    parser.prototype.parseCase = function () {
        var n = this.push();

        this.require('case');
        this.consume();
        var case_itemexpr = this.parseExpr();
        this.require(':');
        this.consume();
        var case_stmt = this.parseBlockOrStmt();

        n.type   = 'case_item';
        n.childs = {
            case_itemexpr: case_itemexpr,
            case_stmt:     case_stmt
        };

        return this.pop(n);
    };

    parser.prototype.parseSwitch = function () {
        var n = this.push();

        this.require('switch');
        this.consume();
        var case_expr = this.parseExprBrace();
        this.require('{');
        this.consume();
        var case_items = [];
        var token = this.getToken();
        while (token.text === 'case') {
            case_items.push(this.parseCase());
        }
        token = this.getToken();
        var case_default = null;
        if (token.text === 'default') {
            case_default = this.parseDefault();
        }
        this.require('}');

        n.type = 'switch';
        n.childs = {
            case_expr:    case_expr,
            case_items:   case_items,
            case_default: case_default
        };
        n.method = this.method_buildin + 'statement_switch';

        return n.pop(n);
    };
};