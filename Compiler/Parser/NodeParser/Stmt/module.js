var msg = require('../../../ErrorHandling/errorhandling.js');
module.exports = function (parser) {
    'use strict';
    parser.prototype.createThisNamedRef = function () {
        var n = this.push();
        n.type  = 'identifier';
        n.value = 'this';
        n.childs = {
            ref: null
        };
        n.method = parser.method_buildin + 'module_symbol_this';

        return this.pop(n);
    };

    parser.prototype.createThisSymbol = function () {
        var n = this.push();

        var name = this.createThisNamedRef();
        n.type = 'inst_decl';
        n.childs = {
            type: n.parent,
            name: name,
            init: null
        };
        n.method = this.method_buildin + 'module_this';
        name.childs.ref = n;
        n.parent.addSymbol(name);
        return this.pop(n);
    };

    parser.prototype.parseModuleDecl = function (n) {
        var createN = false;
        if (n === undefined) {
            n = this.push();
            n.createScope();
            n.childs = {};
            createN = true;
        }

        n.type = 'module_decl';
        this.require('module');
        this.consume();

        var mod_name = this.parseNamedRef();
        n.childs.name = mod_name;

        mod_name.childs.ref = n;
        if (n.parent.scope) { /* istanbul ignore else */
            n.parent.addType(mod_name);
        } else {
            msg.error(this, "module decl must be in within a scope!");
        }

        if (n.childs.tparams) {
            if (this.getToken().text === '[') {
                n.childs.tparams_specification = this.parseTemplateParameter();
            }
        }

        n.childs.self = this.createThisSymbol();
        var token = this.getToken();
        n.childs.inheritance = null;
        if (token.text === ':') {
            n.childs.inheritance = this.parseInheritance();
        }
        n.childs.stmt = this.parseBlock({scope: n.scope});
        this.require(';');
        this.consume();

        n.method = this.method_buildin + "module_decl";
        if (createN) {
            return this.pop(n);
        } else {
            return n;
        }
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