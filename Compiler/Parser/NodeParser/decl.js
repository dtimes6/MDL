
module.exports = function (parser) {
    'use strict';
    // require forward looking 2
    parser.prototype.parseFuncDecl = function () {
        var n = this.push();

        var token = this.require('function');
        this.consume();
        n.value  = this.parseNamedRef();
        n.childs.name = n.value;
        n.value.decl = n;
        n.type   = 'function';
        n.method = n;

        token = this.require('(');
        this.consume();
        n.childs.params = [];
        token = this.getToken();
        while (token.text !== ')') {
            n.childs.params.push(this.parseInstDecl());
            token = this.getToken();
            if (token.text === ')') { break; }
            if (token.text === ',') { continue; }
            console.error("Error: require ',' or ')' but got '" + token.text + "'");
        }
        this.consume();
        if (this.getToken() === ':') {
            this.consume();
            n.childs.type = this.parseTypeRef();
        }

        return this.pop(n);
    };

    parser.prototype.parseModuleDecl = function () {
        var n = this.push();

        var token = this.require('module');
        this.consume();
        token = this.requireType('identifier');
        this.consume();

        n.value  = token.text;
        n.type   = ATPParser.typeModule();
        n.method = method_buildin + "module_decl";
        n.parent.scope.type.push(n);

        this.parseModuleBody();

        return this.pop(n);
    };

    parser.prototype.parseModuleBody = function () {
        var token = this.require('{');
        token = this.getToken();
        while (token.text !== '}') {
            if (token.text === 'element') {
                this.parseElementDecl();
            } else if (token.text === 'module') {
                this.parseModuleDecl();
            } else if (token.text === 'function') {
                this.parseFuncDecl();
            } else if (token.text === 'enum') {
                this.parseEnumDecl();
            } else {
                this.parseMemberDecl();
            }
        }
    };
};