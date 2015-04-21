module.exports = function (parser) {
    parser.prototype.parseLanguage = function () {
        var n = this.push();

        this.require('language');
        this.consume();
        var lang = this.requireType('string').text;
        this.consume();


        var attributes = {};
        this.require('(');
        this.consume();

        if (this.getToken().text === ')') {
            this.consume();
        } else {
            var attrs = [];
            attrs.push(this.requireType('string').text);
            this.consume();
            while (this.getToken().text === ',') {
                this.consume();
                attrs.push(this.requireType('string').text);
                this.consume();
            }
            this.require(')');
            this.consume();

            for (var i in attrs) {
                var attr = attrs[i];
                if (attr.match(/^"(~)?[A-Za-z_][A-Za-z0-9_]*"$/)) {
                    var on  = attr[1] === '~' ? 0 : 1;
                    var key = attr.substr(2 - on, attr.length - 3 + on);
                    attributes[key] = on;
                } else {
                    throw "Error: Cannot recognize attribute '" + attr + "'";
                }
            }
        }
        var stmt = this.parseBlockOrStmt();
        n.type = 'language';
        n.childs = {
            lang:  lang,
            attrs: attributes,
            stmt:  stmt
        };
        n.method = this.method_buildin + 'language';

        return this.pop(n);
    };
};