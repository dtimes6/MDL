module.exports = function (parser) {
    'use strict';
    parser.prototype.parseSymbolNext = function (n) {
        var token = this.getToken();
        if (token) {
            if (token.text === "::") {
                this.consume();
                return this.parseSymbol(n);
            }
            if (token.text === "[") {
                return this.parseSymbolSelection(n);
            }
            if (token.text === '(') {
                return this.parseFuncCall(n);
            }
            if (token.text === '.') {
                this.consume();
                return this.parseMember(n);
            }
        }
        return n;
    };

    parser.prototype.parseSymbol = function (path) {
        var n = this.push();

        var name = this.requireType('identifier').text;
        this.consume();

        n.type = 'symbol';
        n.childs = {
            path: null,
            name: name,
            ref:  null
        };
        n.value = name;
        if (path) {
            n.appendChild('path', path);
        }

        this.pop(n);
        return this.parseSymbolNext(n);
    };

    parser.prototype.parseParameter = function (token, params) {
        if (token.type === 'identifier') {
            var clone = this.clone();
            clone.parseSymbol();
            var t = clone.getToken();
            params.push(this.parseSymbol());
        } else if (token.isNumber()) {
            params.push(this.parseNumber());
        } else if (token.isString()) {
            params.push(this.parseString());
        } else {
            params.push(this.parseExprBrace());
        }
    };

    parser.prototype.parseSymbolSelection = function (base) {
        var n = this.push();

        n.type = 'selection';
        n.childs = {
            base:  null
        };
        n.appendChild('base', base);

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
            if (this.getToken().text === ':') {
                n.childs.range = true;
                this.consume();
            }
        }
        n.childs.params = params;
        this.consume();
        this.pop(n);
        return this.parseSymbolNext(n);
    };

    parser.prototype.parseFuncCall = function (func) {
        var n = this.push();

        n.type = 'func_call';
        n.childs = {
            func:   null,
            ref:    null,
            params: this.parseExprBrace()
        };
        n.appendChild('func', func);

        this.pop(n);
        return this.parseSymbolNext(n);
    };

    parser.prototype.parseMember = function (path) {
        var n = this.push();

        var name = this.requireType('identifier').text;
        this.consume();

        n.type = 'member';
        n.childs = {
            path: null,
            name: name,
            ref: null
        };
        n.value = name;
        n.appendChild('path', path);

        this.pop(n);
        return this.parseSymbolNext(n);
    };
};
