///
/// if expr should have Type
/// if symbol should alias to the declaration
/// if type should alias to the definition
/// if function call should alias to the definition
/// if template should clone and expand
///
/// member should be alias to the copy of the scoped variable
/// which means the expr based stuff should all carry a definition of a temporary instance

var msg = require('../../ErrorHandling/errorhandling.js');
module.exports = function (node) {
    'use strict';
    require('./resolveType.js')(node);
    require('./resolveExpr.js')(node);
    require('./resolveStatement.js')(node);

    node.prototype.resolveInstance = function () {
        switch (this.type) {
            case 'symbol': {
                if (this.childs.base) {
                    this.scope.base.resolveType();
                }
                this.childs.ref = this.lookupVariable();
                if (this.childs.ref === null) {
                    msg.error("Cannnot find type: " + this.childs.name + "!");
                }
            } break;
            case 'member': {
                this.childs.path.resolve();
                this.childs.ref = this.lookupVariable();
            } break;
            default: {
                console.log(this.type + " Should be implemented!");
            }
        }
    };
    node.prototype.resolveFuncCall = function () {
        this.childs.func.resolve();
        for (var i in this.childs.params) {
            this.childs.params[i].resolve();
        }
        var ref = this.childs.func.childs.ref;
        // find type match
        var match = {};
        for (var i in ref) {
            var func = ref[i].childs.ref;
            var m = func.methodMatch(this.childs.params);
            if (m === null) {
                if (match[m]) {
                    match[m].push(func);
                } else {
                    match[m] = [func];
                }
            }
        }
        var keys = Object.keys(match).sort(function (l,r) {return l > r; });
        if (keys.length) {
            var funclist = match[keys[0]];
            if (funclist.length === 1) {
                this.childs.ref = funclist[0];
            }
        } else {
            msg.error(this, "Cannot resolve function: '" + this.childs.func.childs.name + "'");
        }

        if (this.childs.ref.childs.tparams) {
            /// TODO prepare template parameter
            this.childs.ref.resolveTemplateMethod();
        } else {
            this.childs.ref.resolveMethod();
        }

        // TODO according to function call type do copyscope
    };

    node.prototype.methodMatch = function (params) {
        if (params) {
            if (params.length !== this.childs.params) {
                /// TODO needs do type checking
                lllll
                return null;
            }
        } else if (this.childs.params) {
            return null;
        }
        return 0;
    };

    node.prototype.resolveMethod = function () {
        for(var i in this.childs.params) {
            this.childs.params[i].resolve();
        }
        if (this.childs.type) {
            this.childs.type.resolveType();
        }
        this.childs.stmt.resolve();
    };

    /// factory methods:
    node.resolve = function (n) {
        if (n) {
            if (n instanceof node.Node) {
                n.resolve();
            } else if (n instanceof Array) {
                for (var i in n) {
                    node.resolve(n[i]);
                }
            } else if (typeof n === 'object') {
                var keys = Object.keys(n);
                for (var i in keys) {
                    node.resolve(n[keys[i]]);
                }
            }
        }
    };

    node.prototype.resolveChilds = function () {
        node.resolve(this.childs);
    };

    node.prototype.resolveSymbolScope = function (type) {
        if (type.type === 'module_decl') {
            this.createScope();
            this.scope.symbol = node.clone(type.scope.symbol);
            var createThisSymbol = function (s) {
                var n = new node.Node();
                n.type = 'symbol';
                n.childs = {
                    path: null,
                    name: 'this',
                    ref:  s
                }
                n.value = 'this';
                n.parent = s;
                s.addSymbol(n);
            };
            createThisSymbol(this);
        }
    };

    ///
    node.prototype.resolve = function () {
        switch (this.type) {
            case 'func_call'   : return this.resolveFuncCall();
            case 'inst_decl'   : return this.resolveInstDecl();
            case 'member'      :
            case 'symbol'      : return this.resolveInstance();
            case 'if'          :
            case 'block'       :
            case 'root'        :
            case 'return'      :
            case 'operation'   : return this.resolveChilds();
            case 'module_decl' :
            case 'function_decl':
            case 'process_decl':
            case 'element'     :
            case 'number'      :
            case 'identifier'  : break;
            default : {
                console.log(this.type + " Should be implemented!");
            }
        }
    };
};
