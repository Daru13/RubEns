define(["require", "exports", "./Tool", "../EventManager", "../HistoryStep"], function (require, exports, Tool_1, EventManager_1, HistoryStep_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Abstract tool used to draw simple shapes, like rectangles, ellipses or lines.
     *
     * The user select two points by clicking and then releasing the mouse button, and the
     * shape will be drawn between these two points.
     */
    class SimpleShapeTool extends Tool_1.Tool {
        /**
         * Basic constructor.
         *
         * @author Mathieu Fehr
         */
        constructor() {
            super();
            this.firstPoint = null;
            this.secondPoint = null;
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
            this.eventHandlers.push({
                eventTypes: ["mouseup"],
                selector: "body",
                callback: (event) => this.onMouseUp(event)
            });
            this.eventHandlers.push({
                eventTypes: ["mousemove"],
                selector: "body",
                callback: (event) => this.onMouseMove(event)
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
            this.firstPoint = this.workspace.getMouseEventCoordinates(event);
            this.firstPoint.x = Math.floor(this.firstPoint.x);
            this.firstPoint.y = Math.floor(this.firstPoint.y);
        }
        /**
         * The action made when the user release the mouse button in the drawing canvas.
         *
         * @param event The event triggering this function
         *
         * @author Mathieu Fehr
         */
        onMouseUp(event) {
            if (this.firstPoint === null) {
                return;
            }
            let previousImageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            this.workspace.applyWorkingCanvas();
            let newImageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            this.saveInHistory(previousImageData, newImageData);
            this.firstPoint = null;
            this.secondPoint = null;
        }
        /**
         * The action made when the user move the mouse in the drawing canvas.
         *
         * @param event The event triggering this function
         *
         * @author Mathieu Fehr
         */
        onMouseMove(event) {
            if (this.firstPoint === null) {
                return;
            }
            this.secondPoint = this.workspace.getMouseEventCoordinates(event);
            this.secondPoint.x = Math.floor(this.secondPoint.x);
            this.secondPoint.y = Math.floor(this.secondPoint.y);
            this.drawShape(this.firstPoint, this.secondPoint);
        }
        /**
         * This function save the applied operation by the tool in the history.
         *
         * @param  {ImageData} previousImageData the ImageData before the effect is applied.
         * @param  {ImageData} newImageData      the ImageData after the effect is applied.
         * @return {void}                      Returns nothing, works by side-effect.
         *
         * @author Josselin GIET
         */
        saveInHistory(previousImageData, newImageData) {
            EventManager_1.EventManager.spawnEvent("rubens_historySaveStep", new HistoryStep_1.EditLayerStep(this.name, previousImageData, newImageData, this.workspace.drawingLayers.selectedLayer.id));
        }
    }
    exports.SimpleShapeTool = SimpleShapeTool;
});
