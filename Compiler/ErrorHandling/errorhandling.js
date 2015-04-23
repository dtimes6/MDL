var ErrorHandling = {
    debug: false,
    error: function (env, str) {
        'use strict';
        if (ErrorHandling.debug) {
            show_error_stack;
        }
        throw "Error: " + str;
    },
    warning: function (env, str) {
        'use strict';
        console.warn("Warning: " + str);
    }
};

module.exports = ErrorHandling;