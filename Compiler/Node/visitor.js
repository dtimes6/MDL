module.exports = function (node) {
    'use strict';

    // visit the same part of the two l and r
    node.crossvisitor = function (l, r, func) {
        if (func.visit === undefined) {
            func.visit = [];
        }
        node.crossvisit(l, r, func);
        for(var i in func.visit) {
            delete func.visit[i].visited;
        }
    };

    node.crossvisit = function (l, r, func) {
        if (l && r) {
            if ((l instanceof node.Node) &&
                (r instanceof node.Node)) {
                if ((l.visited === true) &&
                    (r.visited === true)) { return; }
                if (l.visited !== true) {
                    l.visited = true;
                    func.visit.push(l);
                }
                if (r.visited !== true) {
                    r.visited = true;
                    func.visit.push(r);
                }
                if (func.before) {
                    if(func.before(l, r)) {
                        return;
                    }
                }
                if (l.type !== r.type) {
                    return;
                }
                var keys = Object.keys(l.childs);
                for(var i in keys) {
                    node.crossvisit(l.childs[keys[i]], r.childs[keys[i]], func);
                }

                if (func.after) {
                    func.after(l, r);
                }
                return;
            }
            if ((l instanceof Array) &&
                (r instanceof Array) &&
                l.length == r.length) {
                for (var i in l) {
                    node.crossvisit(l[i], r[i], func);
                }
                return;
            }
            if ((typeof l === 'object') &&
                (typeof r === 'object')) {
                var keys = Object.keys(l);
                for (var i in keys) {
                    if (r[keys[i]]) {
                        node.crossvisit(l[keys[i]], r[keys[i]], func);
                    }
                }
                return;
            }
        }
    };

    node.visitor = function (n, func) {
        if (func.visit === undefined) {
            func.visit = [];
        }
        node.visit(n, func);
        for(var i in func.visit) {
            delete func.visit[i].visited;
        }
    };

    node.visit = function (n, func) {
        if (n) {
            if (n instanceof node.Node) {
                if (n.visited === true) { return; }
                n.visited = true;
                func.visit.push(n);
                if (func.before) {
                    if(func.before(n)) {
                        return;
                    }
                }
                var keys = Object.keys(n.childs);
                for(var i in keys) {
                    node.visit(n.childs[keys[i]], func);
                }
                if (func.after) {
                    func.after(n);
                }
                return;
            }
            if (n instanceof Array) {
                for (var i in n) {
                    node.visit(n[i], func);
                }
                return;
            }
            if (typeof n === 'object') {
                var keys = Object.keys(n);
                for (var i in keys) {
                    node.visit(n[keys[i]], func);
                }
                return;
            }
        }
    };

    node.reconstruct = function (n, func) {
        if (n) {
            if (n instanceof node.Node) {
                return func(n);
            }
            if (n instanceof Array) {
                var list = [];
                for (var i in n) {
                    var l = node.reconstruct(n[i], func);
                    if (l) {
                        list.push(l);
                    }
                }
                return list;
            }
            if (typeof n === 'object') {
                var obj = {};
                var keys = Object.keys(n);
                for (var i in keys) {
                    var key = keys[i];
                    var value = n[key];
                    obj[key] = node.reconstruct(value, func);
                }
                return obj;
            }
        }
        return n;
    };

    node.collector = function(n, v, func) {
        if (v) {
            if (v instanceof node.Node) {
                func(n, v);
                return;
            }
            if (v instanceof Array) {
                for (var j in v) {
                    node.collector(n, v[j], func);
                }
                return;
            }
            if (typeof v === 'object') {
                var ks = Object.keys(v);
                for (var j in ks) {
                    node.collector(n, v[ks[j]], func);
                }
                return;
            }
        }
    };
};