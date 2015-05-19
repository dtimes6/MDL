module.exports = function (parser) {
    'use strict';

    parser.prototype.parseTypeDef = function () {
        var n = this.push();
        n.childs = {};
        n.type = 'typedef';
        this.require('typedef');
        this.consume();

        var original = this.parseType();
        var name = this.parseNamedRef();
        n.childs.name = name;
        name.childs.ref = n;

        if (n.parent.scope) {
            n.parent.addType(name);
        } else {
            msg.error(this, "typedef must be within a scope!");
        }
        this.require(';');
        this.consume();
        return this.pop(n);
    };
}