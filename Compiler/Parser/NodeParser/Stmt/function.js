module.exports = function (parser) {
    'use strict';
    parser.prototype.parseProcessDecl = function () {
        var n = this.push();
        n.createScope();
        n.type   = 'process_decl';

        this.require('process');
        this.consume();

        var func_name  = this.parseNamedRef();

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
            proc:   true,
            name:   func_name,
            type:   func_ret,
            params: params,
            stmt:   func_body
        };
        n.method = this.method_buildin + 'process_decl';
        func_name.childs.ref = n;
        if (n.parent.scope) {
            n.parent.scope.method.push(func_name);
        } else {
            throw "Error: function decl must be in within a scope!";
        }

        return this.pop(n);
    };
    // require forward looking 2
    parser.prototype.parseFuncDecl = function () {
        var n = this.push();
        n.createScope();
        n.type   = 'function_decl';

        this.require('function');
        this.consume();

        var func_name  = this.parseNamedRef();

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
            proc:   false,
            name:   func_name,
            type:   func_ret,
            params: params,
            stmt:   func_body
        };
        n.method = this.method_buildin + 'function_decl';
        func_name.childs.ref = n;
        if (n.parent.scope) {
            n.parent.scope.method.push(func_name);
        } else {
            throw "Error: function decl must be in within a scope!";
        }

        return this.pop(n);
    };

    parser.prototype.parseOperDecl = function () {
        var n = this.push();
        n.createScope();
        n.type   = 'operation_decl';

        this.require('function');
        this.consume();

        var func_name  = this.parseOperRef();

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

        /// TODO check operator params number with the operref and unique the string
        n.childs = {
            proc:   false,
            name:   func_name,
            type:   func_ret,
            params: params,
            stmt:   func_body
        };
        n.method = this.method_buildin + 'operation_decl';
        func_name.childs.ref = n;
        if (n.parent.scope) {
            n.parent.scope.operator.push(func_name);
        } else {
            throw "Error: operation decl must be in within a scope!";
        }

        return this.pop(n);
    };
};
