var msg = require('../../ErrorHandling/errorhandling.js');
module.exports = function (parser) {
    'use strict';
    // token related
    parser.prototype.getToken = function (n) {
        if (n === undefined) { n = 1; }
        var l = this.tokenProvider.getToken(n);
        if (l && l.length >= n) {
            return l[n - 1];
        }
        return null;
    };

    parser.prototype.getNumber = function () {
        var token = this.getToken(1);
        if (token.isNumber()) {
            return token;
        }
        msg.error(this, "require a number but got: '" + token.text + "'");
    };

    parser.prototype.getString = function () {
        var token = this.getToken(1);
        if (token.isString()) {
            return token;
        }
        msg.error(this, "require a string but got: '" + token.text + "'");
    };

    parser.prototype.consume = function (n) {
        return this.tokenProvider.consume(n);
    };

    parser.prototype.require = function (s) {
        return this.tokenProvider.require(s);
    };

    parser.prototype.requireType = function (t) {
        return this.tokenProvider.requireType(t);
    };

    parser.prototype.createTokenProvider = function (buffer) {
        var TokenProvider = require('../token.js').TokenProvider;
        this.tokenProvider = new TokenProvider(buffer);
    };

    parser.prototype.clone = function (pos) {
        var clone = new parser();
        clone.createTokenProvider(this.tokenProvider.buffer);
        clone.tokenProvider.pos = pos;
        return clone;
    };

    parser.prototype.testIsInstTemplateOrArrayDecl = function (pos) {
        var TokenProvider = require('../token.js').TokenProvider;
        var tokenProvider = new TokenProvider(this.tokenProvider.buffer.substring(pos));
        tokenProvider.consume();
        var brace = 0;
        while (tokenProvider.getToken()) {
            var token = tokenProvider.getToken()[0];
            if (token.text === '[') {
                ++brace;
            } else if (token.text === ']') {
                --brace;
            } else if (brace === 0 && token.type === 'identifier') {
                return true;
            }
            tokenProvider.consume();
        }
        return false;
    };
};
