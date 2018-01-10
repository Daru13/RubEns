define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Set of parameters at the application level.
     */
    class RubEnsParameters {
        constructor() {
            /**
             * Automatically create a new document with default parameters on startup.
             * @type {boolean}
             */
            this.createDocumentOnStartup = true;
        }
    }
    exports.RubEnsParameters = RubEnsParameters;
});
