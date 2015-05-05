module.exports = function (parser) {
    'use strict';
    parser.prototype.parseType = function () {
        return this.parseSymbol();
    };
};