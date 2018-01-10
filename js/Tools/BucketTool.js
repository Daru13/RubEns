define(["require", "exports", "./Tool", "../utils/Color", "../EventManager", "../HistoryStep"], function (require, exports, Tool_1, Color_1, EventManager_1, HistoryStep_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Tool used to select an area that has the same color.
     * The user click on a pixel, and the zone with the same color is selected.
     */
    class BucketTool extends Tool_1.Tool {
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
            this.name = "Fill area";
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
         * Will select the adjacent area that has the same color than the pixel selected.
         *
         * @author Mathieu Fehr
         */
        onMouseDown(event) {
            let imageData = new ImageData(this.workspace.width, this.workspace.height);
            let previousImageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            this.workspace.selectedArea.data.forEach((value, index, array) => {
                let color = Color_1.Color.buildFromHex(this.documentParameters.sharedToolParameters.mainColor.value);
                if (value !== 0) {
                    imageData.data[4 * index] = color.red;
                    imageData.data[4 * index + 1] = color.green;
                    imageData.data[4 * index + 2] = color.blue;
                    imageData.data[4 * index + 3] = color.alpha;
                }
            });
            this.workspace.workingCanvas.setImageData(imageData);
            this.workspace.applyWorkingCanvas();
            this.saveInHistory(previousImageData, imageData);
        }
        /**
         * This function save the drawn shape in the history.
         * @return {[type]} [description]
         */
        saveInHistory(previousImageData, newImageData) {
            EventManager_1.EventManager.spawnEvent("rubens_historySaveStep", new HistoryStep_1.EditLayerStep(this.name, previousImageData, newImageData, this.workspace.drawingLayers.selectedLayer.id));
        }
    }
    exports.BucketTool = BucketTool;
});
