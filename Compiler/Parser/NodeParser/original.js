
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
        // TODO check operator string, space should not used between ops
        // TODO ??? check reserved operator such as: . ::
        /* TODO

            join_type operator

            function ',' (type [] list) : vec{type} {
                vec{type} ret;
                for (type l in list) {
                    ret.push(l);
                }
                return ret;
            }



          */
        return this.pop(n);
    };

    parser.prototype.parseNumber = function () {
        var n = this.push();
        n.type   = 'number';
        var token = this.getNumber();
        this.consume();

        n.value  = token.text;
        return this.pop(n);
    };

    parser.prototype.parseString = function () {
        var n = this.push();
        n.type   = 'string';
        var token = this.getString();
        this.consume();

        n.value  = token.text;
        return this.pop(n);
    };
};