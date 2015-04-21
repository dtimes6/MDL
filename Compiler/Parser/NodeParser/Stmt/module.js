
module.exports = function (parser) {
    'use strict';
    parser.prototype.parseModuleDecl = function () {
        var n = this.push();
        n.createScope();
        n.type = 'module_decl';

        this.require('module');
        this.consume();

        var mod_name = this.parseNamedRef();

        var token = this.getToken();
        var inherit = null;
        if (token.text === ':') {
            inherit = this.parseInheritance();
        }
        var mod_blk  = this.parseBlock();

        n.childs = {
            name:        mod_name,
            inheritance: inherit,
            stmt:        mod_blk
        };
        n.method = this.method_buildin + "module_decl";
        mod_name.childs.ref = n;
        if (n.parent.scope) {
            n.parent.scope.type.push(mod_name);
        } else {
            throw "Error: module decl must be in within a scope!";
        }

        return this.pop(n);
    };

    parser.prototype.parseInheritance = function () {
        var n = this.push();
        n.type   = 'inheritance';

        this.require(':');
        this.consume();

        var typelist = [ this.parseType() ];
        while (this.getToken().text === ',') {
            this.consume();
            typelist.push(this.parseType());
        }

        var virtual = null;
        if (this.getToken().text === '(') {
            virtual = this.parseVirtualInheritanceList();
        }

        n.childs = {
            list:   typelist,
            virtual: virtual
        };
        n.method = this.method_buildin + "module_decl_inheritance";

        return this.pop(n);
    };

    parser.prototype.parseVirtualInheritanceList = function () {
        this.require('(');
        this.consume();
        var list = [];

        if (this.getToken().text === '(') {
            list.push(this.parseVirtualInheritanceList());
            while (this.getToken().text === ',') {
                this.consume();
                list.push(this.parseVirtualInheritanceList());
            }
        } else {
            list.push(this.parseType());
            while (this.getToken().text === ',') {
                this.consume();
                list.push(this.parseType());
            }
        }

        this.require(')');
        this.consume();
        return list;
    };
};