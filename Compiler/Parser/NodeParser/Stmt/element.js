module.exports = function (parser) {
    'use strict';
    parser.prototype.parseElementDecl = function () {
        var n = this.push();

        this.require('element');
        this.consume();

        n.type   = 'element';
        n.childs = {
            name: this.parseNamedRef()
        };
        n.childs.name.ref = n;
        n.method = parser.method_buildin + "element_decl";

        n.scopeNode().scope.type.push(n);
        return this.pop(n);
    };
};