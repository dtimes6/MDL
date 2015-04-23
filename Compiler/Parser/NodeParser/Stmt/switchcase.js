var msg = require('../../../ErrorHandling/errorhandling.js');
module.exports = function (parser) {
    'use strict';
    parser.prototype.parseDefault = function () {
        var n = this.push();
        n.type   = 'case_default';

        this.require('default');
        this.consume();
        this.require(':');
        this.consume();
        var case_stmt = this.parseBlockOrStmt();

        n.childs = {
            case_stmt: case_stmt
        };

        return this.pop(n);
    };

    parser.prototype.parseCase = function () {
        var n = this.push();
        n.type   = 'case_item';

        this.require('case');
        this.consume();

        var case_itemexpr = null;
        var token = this.getToken();
        if (token.isNumber()) {
            case_itemexpr = this.parseNumber();
        } else if (token.isString()) {
            case_itemexpr = this.parseString();
        } else {
            msg.error(this, "case expression expected to be a constant string or number but got '" + token.text + "'");
        }

        this.require(':');
        this.consume();
        var case_stmt = this.parseBlockOrStmt();

        n.childs = {
            case_itemexpr: case_itemexpr,
            case_stmt:     case_stmt
        };

        return this.pop(n);
    };

    parser.prototype.parseSwitch = function () {
        var n = this.push();
        n.type = 'switch';

        this.require('switch');
        this.consume();
        var case_expr = this.parseExprBrace();
        this.require('{');
        this.consume();
        var case_items = [];
        var token = this.getToken();
        while (token.text === 'case') {
            case_items.push(this.parseCase());
            token = this.getToken();
        }
        var case_default = null;
        if (token.text === 'default') {
            case_default = this.parseDefault();
        }
        this.require('}');
        this.consume();

        n.childs = {
            case_expr:    case_expr,
            case_items:   case_items,
            case_default: case_default
        };
        n.method = this.method_buildin + 'statement_switch';

        return this.pop(n);
    };
};