define(["require", "exports", "./Tool", "../DrawingPrimitives/Line", "../Parameter", "../utils/Color", "../EventManager", "../HistoryStep"], function (require, exports, Tool_1, Line_1, Params, Color_1, EventManager_1, HistoryStep_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Set of parameters used by [[FreeHandTool]].
     * Default values of those parameters are defined in the class implementation.
     */
    class FreeHandParameters {
        constructor() {
            this.thickness = {
                kind: Params.ParameterKind.Number,
                value: 1,
                name: "Pencil thickness",
                min: 1,
                step: 1
            };
        }
    }
    exports.FreeHandParameters = FreeHandParameters;
    /**
     * Tool used for free-hand drawing.
     *
     * Draw lines between each consecutive points selected by the user with its
     * mouse with left-button pressed.
     */
    class FreeHandTool extends Tool_1.Tool {
        /**
         * Basic constructor.
         *
         * @author Mathieu Fehr
         */
        constructor() {
            super();
            this.name = "Pen";
            this.parameters = new FreeHandParameters();
            this.lastPosition = null;
            this.workingCanvasImageData = null;
            this.initEventHandlers();
        }
        /**
         * The action made when the user click.
         *
         * @author Mathieu Fehr
         */
        onMouseDown(event) {
            // This might happen if the user release the mouse button outside of the web browser
            if (this.lastPosition !== null) {
                return;
            }
            this.workingCanvasImageData = this.workspace.workingCanvas.getImageData();
            this.lastPosition = this.workspace.getMouseEventCoordinates(event);
            this.lastPosition.x = Math.floor(this.lastPosition.x);
            this.lastPosition.y = Math.floor(this.lastPosition.y);
        }
        /**
         * The action made when the user move the mouse.
         *
         * @author Mathieu Fehr
         */
        onMouseMove(event) {
            if (this.lastPosition === null) {
                return;
            }
            let currentPosition = this.workspace.getMouseEventCoordinates(event);
            currentPosition.x = Math.floor(currentPosition.x);
            currentPosition.y = Math.floor(currentPosition.y);
            this.drawLine(this.workspace.workingCanvas, currentPosition);
            this.lastPosition = currentPosition;
        }
        /**
         * The action made when the user release the mouse button.
         *
         * @author Mathieu Fehr
         */
        onMouseUp(event) {
            // We first draw the last line
            this.onMouseMove(event);
            let previousImageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            this.workspace.applyWorkingCanvas();
            let newImageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            this.saveInHistory(previousImageData, newImageData);
            this.lastPosition = null;
            this.workingCanvasImageData = null;
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
         * Draw a line from this.lastPosition to currentPosition on the given canvas.
         *
         * @param image             The image where the line will be drawn
         * @param currentPosition   The current position of the mouse
         *
         * @author Mathieu Fehr
         */
        drawLine(image, currentPosition) {
            let color = Color_1.Color.buildFromHex(this.documentParameters.sharedToolParameters.mainColor.value);
            let thickness = this.parameters.thickness.value / 2;
            Line_1.Line.draw(this.workingCanvasImageData, this.lastPosition, currentPosition, thickness, color);
            image.setImageData(this.workingCanvasImageData);
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
    exports.FreeHandTool = FreeHandTool;
});
