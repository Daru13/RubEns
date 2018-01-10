define(["require", "exports", "./Tool", "../utils/Color", "../EventManager"], function (require, exports, Tool_1, Color_1, EventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Tool used to select the color of the image pointed by the mouse.
     */
    class EyeDropperTool extends Tool_1.Tool {
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
            this.name = "Eye Dropper";
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
                selector: "canvas",
                callback: (event) => this.onMouseDown(event)
            });
        }
        /**
    
         * The action made when the user click.
         * Will select the color of the pixel pointed by the mouse on the image.
         *
         * @author Mathieu Fehr
         */
        onMouseDown(event) {
            let point = this.workspace.getMouseEventCoordinates(event);
            let imageData = this.workspace.drawingCanvas.getImageData();
            let position = Math.round(point.x) + imageData.width * Math.round(point.y);
            let red = imageData.data[4 * position];
            let green = imageData.data[4 * position + 1];
            let blue = imageData.data[4 * position + 2];
            let alpha = imageData.data[4 * position + 3];
            if (alpha !== 0) {
                let color = new Color_1.Color(red, green, blue, alpha);
                this.documentParameters.sharedToolParameters.mainColor.value = color.getHex();
            }
            EventManager_1.EventManager.spawnEvent("rubens_globalParameterChanged");
        }
    }
    exports.EyeDropperTool = EyeDropperTool;
});
