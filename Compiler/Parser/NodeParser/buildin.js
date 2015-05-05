
module.exports = function (parser) {
    'use strict';
    // buildin
    parser.buildin = {};

    parser.typeOriginal = function () {
        if (parser.buildin.originalType === undefined) {
            var n = new parser.Node();
            n.parent = null;
            n.type  = 'original';
            n.value = 'original';
            parser.buildin.originalType = n;
        }
        return parser.buildin.originalType;
    };

    parser.typeSynth = function () {
        if (parser.buildin.synthType === undefined) {
            var n = new parser.Node();
            n.parent = null;
            n.type  = 'synth';
            n.value = 'synth';
            parser.buildin.synthType = n;
        }
        return parser.buildin.synthType;
    };

    parser.typeMethod = function () {
        if (parser.buildin.methodType === undefined) {
            var n = new parser.Node();
            n.parent = null;
            n.type  = 'method';
            n.value = 'method';
            parser.buildin.methodType = n;
        }
        return parser.buildin.methodType;
    };
};