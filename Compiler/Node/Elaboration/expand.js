var msg = require('../../ErrorHandling/errorhandling.js');
module.exports = function (node) {
    'use strict';
    node.templateExpanding = function (n, params) {
        console.assert(params.length === n.childs.tparams.length);
        for (var i in n.childs.tparams) {
            n.childs.tparams[i].childs.name.childs.ref = params[i];
        }
        return n;
    };

    node.prototype.templateExpanding = function (params) {
        if (this.childs.tparams) {
            return node.templateExpanding(this.clone(), params);
        }
        return this;
    };

    /// template resolving
    node.resolveTemplateParameter = function (types, params) {
        // template type
        var basic = types[0];
        var tparams = basic.childs.ref.childs.tparams;
        for (var i in tparams) {
            if (tparams[i].type === 'typename') {
                params[i].resolveType();
            } else {
                params[i].resolve();
                params[i].constEval();
            }
        }

        // figure out the template type
        var match = node.resolveTemplateTypeMatching(types, params);
        if (match) {
            // template expanding
            return match.obj.templateExpanding(match.params);
        } else {
            msg.error(this, "Cannot resolve template parameter");
            return null;
        }
    };

    node.resolveTemplateTypeMatching = function (types, params) {
        var result = [];
        for (var i in types) {
            var match = node.resolveTemplateType(types[i], params, types[0]);
            if (match) {
                result.push(match);
            }
        }

        if (result.length == 0) {
            return null;
        }
        // Find full order smallest
        // for all match.order[i] ,if i is the result, match.order[i] should have be the smallest and the only one
        var smallest = [];
        for (var i in result) {
            if (i == 0) {
                // deep copy
                for (var j in result[i].order) {
                    smallest.push(result[i].order[j]);
                }
            } else {
                for (var j in result[i].order) {
                    if (result[i].order[j] < smallest[j]) {
                        smallest[j] = result[i].order[j];
                    }
                }
            }
        }
        // if smallest order exist, match is found and we should check for the only one
        var matchresult = [];
        for (var i in result) {
            var isTheOne = true;
            for (var j in result[i].order) {
                if (result[i].order[j] > smallest[j]) {
                    isTheOne = false;
                    break;
                }
            }
            if (isTheOne) {
                matchresult.push(result[i]);
            }
        }
        if (matchresult.length == 1) {
            return matchresult[0];
        }
        return null;
    };

    node.resolveTemplateType = function (name, params, mainDef) {
        var countUndetermined = function (n) {
            var count = 0;
            node.visitor(n, { before: function(n) {
                ++count;
                if (n.value) {
                    return true;
                }
            } });
            return count;
        };
        var nV = [];
        var type = name.childs.ref;
        var main = mainDef.childs.ref;

        var spec = type.childs.tparams_specification;
        if (spec) {
            if (spec.childs.params.length != main.childs.tparams.length) {
                msg.error('Template Specification Mismatch with the main definition!');
                return null;
            }

            var paramdir = {};
            for (var i in spec.childs.params) {
                var mainParam = main.childs.tparams[i];
                if (mainParam.type === 'typename') {
                    spec.childs.params[i].resolveType();
                } else {
                    spec.childs.params[i].resolve();
                    spec.childs.params[i].constEval();
                }

                ///TODO check match with params[i]
                var matchParameter = function (s,p) {
                    var matchedparams = [];
                    var unmatched = false;
                    node.crossvisitor(s,p, { before: function(l,r) {
                        if (l.type === 'typename') {
                            matchedparams.push({
                                name: l.childs.name.value,
                                param: r
                            });
                            return true;
                        } else if (l.type === 'symbol') {
                            matchedparams.push({
                                name: l.childs.name,
                                param: r
                            });
                            return true;
                        } else {
                            if (l.type  !== r.type) {
                                unmatched = true;
                                return true;
                            }
                            if (l.value !== r.value) {
                                unmatched = true;
                                return true;
                            }
                            if (l.value && (l.value == r.value)) {
                                return true;
                            }
                        }
                    }});
                    if (unmatched) {
                        return null;
                    }
                    return matchedparams;
                };
                var matchedparams = matchParameter(spec.childs.params[i], params[i]);
                if (matchedparams === null) {
                    return null; // not match
                }
                var nv = 0;
                for (var i in matchedparams) {
                    var mp = matchedparams[i];
                    nv += countUndetermined(mp);

                    if (paramdir[mp.name]) {
                        ///TODO check exact match the two
                        if (node.same(paramdir[mp.name],mp.param) !== true) {
                            return null;
                        }
                    } else {
                        paramdir[mp.name] = mp.param;
                    }
                }
                nV.push(nv);
            }
            /// reorder according to tparam and return;

            var match = {
                obj:    name,
                params: paramlist,
                order:  nV
            };
            return match;
        } else {
            var paramlist = params;
            for (var i in type.childs.tparams) {
                nV.push(countUndetermined(params[i]));
            }
            var match = {
                obj:    name,
                params: paramlist,
                order:  nV
            };
            return match;
        }
    };
};