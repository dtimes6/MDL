module.exports = function (parser) {
    'use strict';
    parser.prototype.parseType = function () {
        var n = this.push();
        n.type = 'type';
        n.childs = {};

        var type_hierarchy = [this.requireType('identifier').text];
        this.consume();
        while (this.getToken().text === '::') {
            this.consume();
            type_hierarchy.push(this.requireType('identifier').text);
            this.consume();
        }
        var type = this.lookupForType(n, type_hierarchy);
        n.childs.base  = type;

        if (type instanceof Array) {
            // template type
            n.childs.tparams_specification = this.parseTemplateParameter();
        }
        var range = [];
        var token = this.getToken();
        while (token.text === '[') {
            this.consume();
            var left  = null;
            var right = null;
            token = this.getToken();
            if (token.text === ']') {
                this.consume();
            } else {
                left = this.parseExpr();
                if (left.type === 'operation' &&
                    left.childs.op === '$:$') {
                    right = left.childs.params[1];
                    left  = left.childs.params[0];
                }
                this.require(']');
                this.consume();
            }
            range.push({left: left, right: right});
            token = this.getToken();
        }
        n.childs.range = range;
        n.method = this.method_buildin + 'type';

        return this.pop(n);
    };
};