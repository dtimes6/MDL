module.exports = function (parser) {
    'use strict';
    parser.prototype.parseType = function () {
        var n = this.push();
        n.type = 'type';

        var type_hierarchy = [this.requireType('identifier').text];
        while (this.getToken().text === '::') {
            this.consume();
            type_hierarchy.push(this.requireType('identifier').text);
        }

        this.consume();
        var type = this.lookupForType(n, type_hierarchy);
        var range = [];

        var token = this.getToken();
        while (token.text === '[') {
            this.consume();
            var left  = this.parseExpr();
            var right = null;
            token = this.getToken();
            if (token.text === ':') {
                this.consume();
                right = this.parseExpr();
            }
            this.require(']');
            range.push({left: left, right: right});
            token = this.getToken();
        }

        n.childs = {
            base: type,
            range: range
        };
        n.method = this.method_buildin + 'type';

        return this.pop(n);
    };
};