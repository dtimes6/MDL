module.exports = function (parser) {
    'use strict';

    parser.prototype.nullStmt = function () {
        var n = this.push();

        this.require(';');
        this.consume();

        n.type = 'null';
        return this.pop(n);
    };

    parser.prototype.parseExprStmt = function () {
        if (this.getToken().text === ';') {
            return this.nullStmt();
        }
        var n = this.parseExprCanDecl();
        this.require(';');
        this.consume();
        return n;
    };
};
