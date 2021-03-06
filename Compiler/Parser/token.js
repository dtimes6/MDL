/***
 * @file:   token.js
 * @author: Peng Dai
 *
 * @brief： Lexical analyser
 *
 * MDL
 *
 * Copyright (C) 2015, Peng Dai. All rights reserved!
 *
 ***/
var msg = require('../ErrorHandling/errorhandling.js');

var Token = function (type, pos, text) {
    'use strict';
    this.type = type;
    this.text = text;
    this.pos  = pos;
};

Token.prototype.getLength = function () {
    'use strict';
    return this.text.length;
};

Token.prototype.isNumber = function () {
    'use strict';
    return this.type === 'binary' ||
           this.type === 'octal' ||
           this.type === 'hexadecimal' ||
           this.type === 'float' ||
           this.type === 'decimal';
};

Token.prototype.isString = function () {
    'use strict';
    return this.type === 'string_quoted'  ||
           this.type === 'string_dquoted' ||
           this.type === 'string_block';
};

Token.prototype.isOperator = function () {
    'use strict';
    return this.type !== 'identifier' && !this.isNumber() && !this.isString();
};

var TokenProvider = function (buffer) {
    'use strict';
    this.buffer = buffer;
    this.pos    = 0;
    this.tokenPool = [];
    this.tokenPos  = 0;
};

TokenProvider.func = {
    basic : function (type, provider, text) {
        'use strict';
        console.assert(type !== null, "Should not be of null");
        console.assert(text !== null, "Should not be of null");
        var token = new Token(type, provider.pos, text);
        provider.pos += token.getLength();
        return token;
    },
    block_comment: function (type, provider, text) {
        'use strict';
        var pos = provider.pos + 3;
        while (pos < provider.buffer.length) {
            if (provider.buffer[pos]     === '/' && provider.buffer[pos - 1] === '*') {
                text = provider.buffer.substr(provider.pos, pos - provider.pos + 1);
                return TokenProvider.func.basic(type, provider, text);
            }
            ++pos;
        }
        msg.error(this, "Cannot find end of block comment!");
    },
    string: function (type, provider, text, quote) {
        'use strict';
        var pos = provider.pos + 1;
        while (pos < provider.buffer.length) {
            if (provider.buffer[pos]     === quote && provider.buffer[pos - 1] !== '\\') {
                text = provider.buffer.substr(provider.pos, pos - provider.pos + 1);
                return TokenProvider.func.basic(type, provider, text);
            }
            ++pos;
        }
        msg.error(this, "Cannot find end of string!");
    },
    quoted_string: function (type, provider, text) {
        'use strict';
        return TokenProvider.func.string(type, provider, text, '\'');
    },
    double_quoted_string: function (type, provider, text) {
        'use strict';
        return TokenProvider.func.string(type, provider, text, '"');
    },
    block_string: function (type, provider, text) {
        'use strict';
        var pos = provider.pos + 3;
        while (pos < provider.buffer.length) {
            if (provider.buffer[pos]     === '"' && provider.buffer[pos - 1] === '"' && provider.buffer[pos - 2] === '"') {
                text = provider.buffer.substr(provider.pos, pos - provider.pos + 1);
                return TokenProvider.func.basic(type, provider, text);
            }
            ++pos;
        }
        msg.error(this, "Cannot find end of string!");
    }
};

TokenProvider.enum = {
    // comment
    comment_line  : [/^\/\/[^\n]*\n/,          TokenProvider.func.basic],
    comment_block : [/^\/\*/,                  TokenProvider.func.block_comment],
    // string
    string_block  : [/^"""/,                   TokenProvider.func.block_string],
    string_quoted : [/^'/,                     TokenProvider.func.quoted_string],
    string_dquoted: [/^"/,                     TokenProvider.func.double_quoted_string],
    // separator
    ';'           : [/^;/,                     TokenProvider.func.basic],
    //brace
    '('           : [/^\(/,                    TokenProvider.func.basic],
    ')'           : [/^\)/,                    TokenProvider.func.basic],
    '['           : [/^\[/,                    TokenProvider.func.basic],
    ']'           : [/^\]/,                    TokenProvider.func.basic],
    '{'           : [/^\{/,                    TokenProvider.func.basic],
    '}'           : [/^\}/,                    TokenProvider.func.basic],
    // common
    space         : [/^[ \n\t]+/,              TokenProvider.func.basic],
    identifier    : [/^[A-Za-z_]\w*/,          TokenProvider.func.basic],
    // number
    binary        : [/^0b[01]*/,               TokenProvider.func.basic],
    octal         : [/^0o[0-7]*/,              TokenProvider.func.basic],
    hexadecimal   : [/^0[xh][0-9A-Fa-f]*/,     TokenProvider.func.basic],
    float         : [/^[0-9]*\.[0-9]+/,        TokenProvider.func.basic],
    decimal       : [/^(0d)?[0-9]+/,           TokenProvider.func.basic],
    // op
    operator      : [/^[^ \t\nA-Za-z0-9_;]+/,   TokenProvider.func.basic]
};

TokenProvider.prototype.parse1Token = function () {
    'use strict';
    var inqueue = this.buffer.substr(this.pos);
    for (var t in TokenProvider.enum) {
        var match = inqueue.match(TokenProvider.enum[t][0]);
        if (match !== null) {
            return TokenProvider.enum[t][1](t, this, match[0]);
        }
    }
    if (inqueue.length) { /* istanbul ignore next */
        msg.error(this, "while parsing: " + inqueue);
    }
    return null;
};

TokenProvider.prototype.enlargeBuffer = function (n) {
    'use strict';
    if (n === undefined) { n = 1; }
    while (this.tokenPos + n > this.tokenPool.length) {
        var token = this.parse1Token();
        if (token === null) { return null; }
        if (token.type !== 'space' &&
            token.type !== 'comment_line' &&
            token.type !== 'comment_block') {
            this.tokenPool.push(token);
        }
    }
    var ret = [];
    for (var i = this.tokenPos; i < this.tokenPos + n; ++i) {
        ret.push(this.tokenPool[i]);
    }
    return ret;
};

TokenProvider.prototype.consume = function (n) {
    'use strict';
    if (n === undefined) { n = 1; }
    var ret = this.enlargeBuffer(n);
    this.tokenPos += n;
    return ret;
};

TokenProvider.prototype.requireType = function (type) {
    'use strict';
    var ret = this.enlargeBuffer(1)[0];
    if (ret.isString() && type === 'string') {
        return ret;
    }
    if (ret.type !== type) {
        msg.error(this, "expected type: '" + type + "' but got '" + ret.type + "' : '" + ret.text + "'");
    }
    return ret;
};

TokenProvider.prototype.require = function (str) {
    'use strict';
    var ret = this.enlargeBuffer(1)[0];
    if (ret.text !== str) {
        msg.error(this, "expected: '" + str + "' but got '" + ret.text + "'");
    }
    return ret;
};

TokenProvider.prototype.getToken = function (n) {
    'use strict';
    return this.enlargeBuffer(n);
};

Token.enum = TokenProvider.enum;
Token.TokenProvider = TokenProvider;

module.exports = Token;