module.exports = function (parser) {
    'use strict';
    require('./Stmt/block.js')(parser);
    require('./Stmt/ctrl.js')(parser);
    require('./Stmt/element.js')(parser);
    require('./Stmt/for.js')(parser);
    require('./Stmt/function.js')(parser);
    require('./Stmt/if.js')(parser);
    require('./Stmt/inst_decl.js')(parser);
    require('./Stmt/language.js')(parser);
    require('./Stmt/module.js')(parser);
    require('./Stmt/switchcase.js')(parser);
    require('./Stmt/type.js')(parser);
    require('./Stmt/while.js')(parser);

    parser.prototype.parseStmt = function () {
        var token = this.getToken();
        // declaration
        if (token.text === 'element') {
            return this.parseElementDecl();
        }
        if (token.text === 'process') {
            token = this.getToken(2);
            if (token.type === 'identifier') {
                return this.parseProcessDecl();
            }
            return this.parseOperProcDecl();
        }
        if (token.text === 'function') {
            token = this.getToken(2);
            if (token.type === 'identifier') {
                return this.parseFuncDecl();
            }
            return this.parseOperDecl();
        }
        if (token.text === 'language') {
            return this.parseLanguage();
        }
        if (token.text === 'module') {
            return this.parseModuleDecl();
        }
        if (token.type === 'template') {
            return this.parseTempDecl();
        }
        // stmt
        if (token.text === 'if') {
            return this.parseIf();      //implemented
        }
        if (token.text === 'switch') {
            return this.parseSwitch();  //implemented
        }
        if (token.text === 'while') {
            return this.parseWhile();   //implemented
        }
        if (token.text === 'do') {
            return this.parseDoWhile(); //implemented
        }
        if (token.text === 'for') {
            return this.parseForForIn();//implemented
        }
        if (token.text === 'return') {
            return this.parseReturn();  //implemented
        }
        if (token.text === 'break') {
            return this.parseBreak();   //implemented
        }
        if (token.text === 'continue') {
            return this.parseContinue();//implemented
        }
        if (token.text === '{') {
            return this.parseBlock();   //implemented
        }
        return this.parseExprStmt();
    };
};
