define(["require", "exports", "./Tool"], function (require, exports, Tool_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Tool used to zoom in the image.
     */
    class ZoomInTool extends Tool_1.Tool {
        /**
         * Basic constructor.
         *
         * @author Mathieu Fehr
         */
        constructor() {
            super();
            /**
             * Name given to the tool.
             * This is the name displayed in the UI
             */
            this.name = "Zoom in";
            this.initEventHandlers();
        }
        /**
         * Setup the event handlers.
         *
         * @author Mathieu Fehr
         */
        initEventHandlers() {
            // Add the event handlers to the event manager
            this.eventHandlers.push({
                eventTypes: ["mousedown"],
                selector: "#drawing_display",
                callback: (event) => this.onMouseDown(event)
            });
        }
        /**
         * The action made when the user click.
         * The zoom will increase in the image.
         *
         * @author Mathieu Fehr
         */
        onMouseDown(event) {
            this.workspace.zoomIn();
        }
    }
    exports.ZoomInTool = ZoomInTool;
});
