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

        n.type = 'tparam_spec';

        this.require('[');
        this.consume();

        var params = [];
        while (this.getToken().text !== ']') {
            var token = this.getToken();
            this.parseParameter(token, params);
            if (this.getToken().text === ',') {
                n.childs.template = true;
                this.consume();
            }
        }
        n.childs.params = params;
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