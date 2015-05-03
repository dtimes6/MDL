module.exports = function (parser) {
    'use strict';
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
        var token = this.getToken();
        if (token.text === "::") {
            this.consume();
            return this.parseSymbol(n);
        }
        if (token.text === "[") {
            return this.parseSymbolSelection(n);
        }
        return n;
    };

    parser.prototype.parseSymbolSelection = function (base) {
        var n = this.push();

        n.type = 'selection';
        n.childs = {
            base: null
        };
        n.appendChild('base', base);

        this.require('[');
        this.consume();

        var params = [];
        while (this.getToken().text !== ']') {
            var token = this.getToken();
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
            if (this.getToken().text === ',') {
                this.consume();
            }
        }
        n.childs.params = params;
        this.consume();
        this.pop(n);

        var token = this.getToken();
        if (token.text === "::") {
            this.consume();
            return this.parseSymbol(n);
        }
        if (token.text === "[") {
            return this.parseSymbolSelection(n);
        }
    };
};
