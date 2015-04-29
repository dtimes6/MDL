module.exports = function (node) {
    'use strict';

    node.prototype.is = function (n) {
        if (this.attribute === undefined) {
            this.attributeBuild();
        }
        return this.attribute[n];
    };

    node.prototype.attributeBuild = function () {
        /// build is template
        node.visitor(this, {
            before:  function (n) {
                if (n.attribute === undefined) {
                    n.attribute = {};
                }
                if (n.type === 'typename') {
                    n.attribute['template'] = true;
                }
            },
            after:   function (n) {
                var merge = function (n, v) {
                    if (n.attribute['template']) { return; }
                    if (v.attribute['template']) { n.attribute['template'] = true; }
                };
                var keys = Object.keys(n.childs);
                for (var i in keys) {
                    var value = n.childs[keys[i]];
                    node.collector(n, value, merge);
                }
            }
        });
    };
};