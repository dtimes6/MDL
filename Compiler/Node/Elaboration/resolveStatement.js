var msg = require('../../ErrorHandling/errorhandling.js');
module.exports = function (node) {
    'use strict';
    /// code safe
    node.prototype.resolveInstDecl = function () {
        this.childs.type.resolveType(); /// Template Types are solved in resolveType function
        this.childs.name.resolve();

        this.childs.name.resolveSymbolScope(this.childs.type.childs.ref.childs.ref);

        if (this.childs.init) {
            this.childs.init.resolve();
        }
    };

    node.prototype.resolveStatement = function () {
        switch (this.type) {
            case 'inst_decl'   : return this.resolveInstDecl();
            case 'while'       :
            case 'do_while'    :
            case 'for'         :
            case 'for_in'      :
            case 'case_default':
            case 'case_item'   :
            case 'switch'      :
            case 'language'    :
            case 'if'          :
            case 'block'       :
            case 'continue'    :
            case 'break'       :
            case 'return'      :
            case 'root'        : return this.resolveChilds();
            default            : return null;
        }
    };
};