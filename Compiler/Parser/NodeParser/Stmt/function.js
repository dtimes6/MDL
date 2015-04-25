var msg = require('../../../ErrorHandling/errorhandling.js');
module.exports = function (parser) {
    'use strict';

    parser.prototype.parseProcessDecl = function () {
        var n = this.push();
        n.createScope();

        var token = this.getToken();
        var keyword = null;
        var is_proc = false;
        if (token.text === 'process') {
            keyword = 'process';
            is_proc = true;
        } else {
            this.require('function');
            keyword = 'function';
        }
        this.consume();

        var func_name = null;
        var category = null;
        if (this.getToken().type === 'identifier') {
            func_name = this.parseNamedRef();
            n.type   = keyword + '_decl';
            category  = 'call';
        } else {
            func_name = this.parseOperRef();
            category  = 'operation';
            n.type   = is_proc ? 'operproc_decl' : 'operation_decl';
        }

        this.require('(');
        this.consume();

        var params = [];
        if (this.getToken().text === ')') {
            this.consume();
        } else {
            while (this.getToken().text !== ')') {
                params.push(this.parseInstDecl());
                if (this.getToken().text === ')') { break; }
                this.require(',');
                this.consume();
            }
            this.consume();
        }

        var func_ret = null;
        if (this.getToken().text === ':') {
            this.consume();
            func_ret = this.parseType();
        }

        var func_body = this.parseBlock();

        n.childs = {
            proc:   is_proc,
            name:   func_name,
            type:   func_ret,
            params: params,
            stmt:   func_body
        };
        n.method = this.method_buildin + n.type;
        func_name.childs.ref = n;
        if (n.parent.scope) {
            n.parent.addMethod(func_name);
        } else {
            msg.error(this, keyword + category + " declaration must be in within a scope!");
        }

        return this.pop(n);
    };
};
