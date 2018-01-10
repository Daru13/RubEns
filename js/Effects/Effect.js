define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A visual effect which can be applied on an image.
     * It must be extended by any actual visual effect.
     */
    class Effect {
        /**
         * Basic constructor.
         *
         * @author Camille Gobert
         */
        constructor() {
            this.parameters = {};
        }
    }
    exports.Effect = Effect;
});
