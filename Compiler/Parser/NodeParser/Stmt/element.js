module.exports = function (parser) {
    'use strict';
    parser.prototype.parseElementDecl = function () {
        var n = this.push();
        n.type   = 'element';

        this.require('element');
        this.consume();

        n.childs = {
            name: this.parseNamedRef()
        };
        n.childs.name.childs.ref = n;
        n.scopeNode().addType(n.childs.name);

        this.require(';');
        this.consume();

        return this.pop(n);
    };
};