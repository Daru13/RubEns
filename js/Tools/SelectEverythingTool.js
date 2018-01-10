define(["require", "exports", "./Tool"], function (require, exports, Tool_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Tool used to select the whole image.
     * When selecting the tool, the whole image is selected.
     */
    class SelectEverythingTool extends Tool_1.Tool {
        /**
         * Instantiates the object, and add the event handlers to the eventManager.
         *
         * @author Mathieu Fehr
         */
        constructor() {
            super();
            /**
             * The name of the tool.
             * This information may for instance be used by the UI.
             */
            this.name = "Select everything";
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
         * The action made when the user clicks in the drawing canvas.
         *
         * @param event The event
         *
         * @author Mathieu Fehr
         */
        onMouseDown(event) {
            this.applySelection();
        }
        /**
         * Select the whole image, and change the workspace.
         *
         * @author Mathieu Fehr
         */
        applySelection() {
            this.workspace.clearSelection();
        }
    }
    exports.SelectEverythingTool = SelectEverythingTool;
});
