var msg = require('../../../ErrorHandling/errorhandling.js');
module.exports = function (parser) {
    'use strict';
    parser.prototype.parseTemplateTypenameDecl = function () {
        var n = this.push();
        n.type = 'typename';

        var type = this.getToken().text;
        this.consume();

        n.childs = {
            type: type,
            name: this.parseNamedRef()
        };
        n.childs.name.childs.ref = n;
        n.method = this.method_buildin + "typename_decl";

        n.scopeNode().addType(n.childs.name);
        return this.pop(n);
    };

    parser.prototype.parseTemplateParameter = function () {
        var n = this.push();

        n.type = 'tparam_specification';
        this.require('[');
        this.consume();

        var tparams = null;
        if (n.parent.type === 'function_decl') {
            var name = n.parent.childs.name.value;
            var symlist = this.lookupForSymbol(n, [name]);
            tparams = symlist[0].childs.ref.childs.tparams;
            if (tparams === undefined) {
                msg.error(this, name + ' is not a template function');
            }
        }
        if (n.parent.type === 'module_decl') {
            var name = n.parent.childs.name.value;
            var typelist = this.lookupForType(n, [name]);
            tparams = typelist[0].childs.ref.childs.tparams;
            if (tparams === undefined) {
                msg.error(this, n.parent.childs.name.value + ' is not a template module');
            }
        }
        if (n.parent.type === 'type') {
            var name = n.parent.childs.base[0].value;
            var typelist = this.lookupForType(n, [name]);
            tparams = typelist[0].childs.ref.childs.tparams;
            if (tparams === undefined) {
                msg.error(this, n.parent.childs.name.value + ' is not a template module');
            }
        }
        if (n.parent.type === 'func_call') {
            tparams = n.parent.childs.method[0].childs.ref.childs.tparams;
            if (tparams === undefined) {
                msg.error(this, n.parent.childs.name.value + ' is not a template function');
            }
        }
        /// Function Call
        /// Module Inheritance
        var list = [];
        var map  = {};
        for (var i in tparams) {
            var name = tparams[i].childs.name.value;
            var t = null;
            if (tparams[i].type === 'typename') {
                t = this.parseType();
            } else if (tparams[i].type === 'element') {
                t = this.parseType();
                //TODO check type
            } else if (tparams[i].type === 'module') {
                t = this.parseType();
                //TODO check type
            } else {
                t = this.parseExpr();
            }
            list.push(t);
            map[name] = t;
        }

        n.childs = {
            list: list,
            map:  map
        };

        this.require(']');
        this.consume();

        return this.pop(n);
    };

    parser.prototype.parseTemplateParameterDecl = function () {
        var node = this.getToken();
        if (node.text === 'typename' ||
            node.text === 'element'  ||
            node.text === 'module') {
            return this.parseTemplateTypenameDecl();
        } else {
            return this.parseInstDecl();
        }
    };

    parser.prototype.parseTemplateDecl = function () {
        var n = this.push();
        n.type = 'template_decl';
        n.createScope();
        this.require('template');
        this.consume();
        this.require('[');
        this.consume();

        var params = [];
        while (this.getToken().text !== ']') {
            params.push(this.parseTemplateParameterDecl());
            if (this.getToken().text === ',') {
                this.consume();
            }
        }
        this.require(']');
        this.consume();
        n.childs = {
            tparams: params
        };

        var stmt = null;
        var token = this.getToken();
        if (token.text === 'process' ||
            token.text === 'function') {
            return this.pop(this.parseProcFuncDecl(n));
        } else if (token.text === 'module') {
            return this.pop(this.parseModuleDecl(n));
        } else {
            msg.error(this, "template declaration should apply on funcion process or module");
        }

        return this.pop(n);
    };
};