
module.exports = function (parser) {
    'use strict';
    // Parse originals
    parser.prototype.parseNamedRef = function () {
        var n = this.push();
        n.type   = 'identifier';

        var token = this.requireType('identifier');
        this.consume();

        n.value  = token.text;
        n.childs = {
            ref: null
        };
        n.method = parser.method_buildin + token.type;

        return this.pop(n);
    };

    parser.prototype.parseOperRef = function () {
        var n = this.push();
        n.type   = 'operator';

        var token = this.requireType('string');
        this.consume();

        n.value  = token.text;
        n.childs = {
            ref: null
        };
        n.method = parser.method_buildin + "operator";
        // TODO check operator string, space should not used between ops
        // TODO ??? check reserved operator such as: . ::
        return this.pop(n);
    };

    parser.prototype.parseNumber = function () {
        var n = this.push();
        n.type   = 'number';
        var token = this.getNumber();
        this.consume();

        n.value  = token.text;
        n.method = parser.method_buildin + token.type;

        return this.pop(n);
    };

    parser.prototype.parseString = function () {
        var n = this.push();
        n.type   = 'string';
        var token = this.getString();
        this.consume();

        n.value  = token.text;
        n.method = parser.method_buildin + token.type;

        return this.pop(n);
    };
};