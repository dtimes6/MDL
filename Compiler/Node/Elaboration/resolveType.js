var msg = require('../../ErrorHandling/errorhandling.js');
module.exports = function (node) {
    'use strict';
    node.prototype.resolveType = function () {
        switch (this.type) {
            case 'selection': {
                if (this.childs.base) {
                    this.childs.base.resolveType();
                }

                // For template
                if (this.childs.base.childs.ref instanceof Array) {
                    this.childs.ref = node.resolveTemplateParameter(this.childs.base.childs.ref, this.childs.params);
                    this.childs.template = true;
                    return;
                }

                if (this.childs.range) {
                    console.log(this);
                }
            } break;
            case 'symbol': {
                if (this.childs.path) {
                    this.scope.path.resolveType();
                }
                var type = this.lookupType();
                this.childs.ref = type;
                if (this.childs.ref === null) {
                    msg.error("Cannnot find type: " + this.childs.name + "!");
                }
            } break;
            default: {
                console.log(this.type + " Should be implemented!");
            }
        }
    };
};