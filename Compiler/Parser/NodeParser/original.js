
module.exports = function (parser) {
    'use strict';
    // Parse originals
    parser.prototype.parseNamedRef = function () {
        var n = this.push();

        var token = this.requireType('identifier');
        this.consume();

        n.value  = token.text;
        n.childs = {
            ref: null
        };
        n.type   = 'identifier';
        n.method = parser.method_buildin + token.type;

        return this.pop(n);
    };

    parser.prototype.parseNumber = function () {
        var n = this.push();

        var token = this.getNumber();
        this.consume();

        n.value  = token.text;
        n.type   = 'number';
        n.method = parser.method_buildin + token.type;

        return this.pop(n);
    };

    parser.prototype.parseString = function () {
        var n = this.push();

        var token = this.getString();
        this.consume();

        n.value  = token.text;
        n.type   = 'string';
        n.method = parser.method_buildin + token.type;

        return this.pop(n);
    };
};