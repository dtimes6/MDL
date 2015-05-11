var msg = require('../../ErrorHandling/errorhandling.js');
module.exports = function (node) {
    'use strict';
    node.prototype.constEval = function () {
        if (this.value) { return; }
    };
};