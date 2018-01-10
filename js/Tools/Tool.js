define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A tool available to the user for drawing/modifying the image.
     */
    class Tool {
        /**
         * Basic constructor.
         *
         * @author Mathieu Fehr
         */
        constructor() {
            /**
             * The set of parameters local to the tool.
             * It may be empty.
             */
            this.parameters = {};
            this.eventHandlers = [];
        }
        /**
         * Register all necessary events handlers required by the tool.
         * @param eventManager The manager dispatching the events.
         *
         * @author Mathieu Fehr
         */
        registerEvents(eventManager) {
            for (let handler of this.eventHandlers) {
                eventManager.registerEventHandler(handler);
            }
        }
        /**
         * See documentation of registerEvents, and change register with unregister.
         * @param eventManager The manager dispatching the events.
         *
         * @author Mathieu Fehr
         */
        unregisterEvents(eventManager) {
            for (let handler of this.eventHandlers) {
                eventManager.unregisterEventHandler(handler);
            }
        }
    }
    exports.Tool = Tool;
});
