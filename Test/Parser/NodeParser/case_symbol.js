var ATPParser = require('../../Compiler/Parser/nodeparser.js');
require('../../test.js')(__filename, function (data) {
    'use strict';
    var parser = new ATPParser();
    parser.createTokenProvider(data);
    var s = parser.parseSymbol();
    console.log(parser.getToken().text);
    console.log(s);
    console.log(s.childs.path);
    console.log(s.childs.path.childs.base);
    var s = parser.parseSymbol();
    console.log(s);
    var s = parser.parseSymbol();
    console.log(s);
});