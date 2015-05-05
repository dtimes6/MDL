var msg = require('../../../ErrorHandling/errorhandling.js');
module.exports = function (parser) {
    'use strict';

    parser.prototype.parseProcFuncDecl = function (n) {
        var createN = false;
        if (n === undefined) {
            n = this.push();
            n.createScope();
            n.childs = {};
            createN = true;
        }

        var token = this.getToken();
        var keyword = null;
        if (token.text === 'process') {
            keyword = 'process';
            n.childs.proc = true;
        } else {
            this.require('function');
            keyword = 'function';
            n.childs.proc = false;
        }
        this.consume();

        var category = null;
        if (this.getToken().type === 'identifier') {
            n.childs.name = this.parseNamedRef();
            n.type   = keyword + '_decl';
            category  = 'call';
        } else {
            n.childs.name = this.parseOperRef();
            n.type   = n.childs.proc ? 'operproc_decl' : 'operation_decl';
            category  = 'operation';
        }

        n.childs.name.childs.ref = n;
        if (n.parent.scope) {
            n.parent.addMethod(n.childs.name);
        } else {
            msg.error(this, keyword + category + " declaration must be in within a scope!");
        }

        if (n.childs.tparams) {
            if (this.getToken().text === '[') {
                n.childs.tparams_specification = this.parseTemplateParameter();
            }
        }

        this.require('(');
        this.consume();

        n.childs.params = [];
        if (this.getToken().text === ')') {
            this.consume();
        } else {
            while (this.getToken().text !== ')') {
                n.childs.params.push(this.parseInstDecl());
                if (this.getToken().text === ')') { break; }
                this.require(',');
                this.consume();
            }
            this.consume();
        }

        n.childs.type = null;
        if (this.getToken().text === ':') {
            this.consume();
            n.childs.type = this.parseType();
        }

        n.childs.stmt = this.parseBlock();
        if (createN) {
            return this.pop(n);
        } else {
            return n;
        }
    };
};
