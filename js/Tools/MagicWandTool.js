define(["require", "exports", "./Tool", "../Image/SelectedArea", "../utils/Point", "../EventManager", "../HistoryStep"], function (require, exports, Tool_1, SelectedArea_1, Point_1, EventManager_1, HistoryStep_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Tool used to select an area that has the same color.
     * The user click on a pixel, and the zone with the same color is selected.
     */
    class MagicWandTool extends Tool_1.Tool {
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
            this.name = "Magic Wand";
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
         * Will select the adjacent area that has the same color than the pixel selected.
         *
         * @author Mathieu Fehr
         */
        onMouseDown(event) {
            // The area selected is the one with the same color as the source pixel.
            let source = this.workspace.getMouseEventCoordinates(event);
            source.x = Math.round(source.x);
            source.y = Math.round(source.y);
            // The height and with of the image
            let imageHeight = this.workspace.height;
            let imageWidth = this.workspace.width;
            let previousSelection = this.workspace.selectedArea;
            let selectedArea = new SelectedArea_1.SelectedArea(imageWidth, imageHeight);
            if (this.workspace.drawingLayers.selectedLayer === null) {
                return;
            }
            let imageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            // The color of the source pixel
            let r = imageData.data[4 * (source.x + imageWidth * source.y)];
            let g = imageData.data[4 * (source.x + imageWidth * source.y) + 1];
            let b = imageData.data[4 * (source.x + imageWidth * source.y) + 2];
            let a = imageData.data[4 * (source.x + imageWidth * source.y) + 3];
            let stack = [source];
            // We do a simple DFS to select the area with the same color
            while (stack.length > 0) {
                let pixel = stack.pop();
                // We check the pixel is in the image bound
                if (pixel.x === -1 || pixel.x === imageWidth || pixel.y === -1 || pixel.y === imageHeight) {
                    continue;
                }
                let offset = (pixel.x + imageWidth * pixel.y);
                // If the pixel has already been set, we can continue
                if (selectedArea.data[offset] === 255) {
                    continue;
                }
                // If the pixel has the same color as the source, we add it to the selection,
                // and add its neighbors.
                if (imageData.data[4 * offset] === r && imageData.data[4 * offset + 1] === g &&
                    imageData.data[4 * offset + 2] === b && imageData.data[4 * offset + 3] === a) {
                    selectedArea.data[offset] = 255;
                    stack.push(new Point_1.Point(pixel.x - 1, pixel.y));
                    stack.push(new Point_1.Point(pixel.x + 1, pixel.y));
                    stack.push(new Point_1.Point(pixel.x, pixel.y - 1));
                    stack.push(new Point_1.Point(pixel.x, pixel.y + 1));
                }
            }
            this.workspace.selectedArea = selectedArea;
            this.workspace.displaySelection();
            this.saveInHistory(previousSelection, selectedArea);
        }
        /**
         * This function saves the changement of SelectedArea.
         * @param  {SelectedArea} previousSelection the SelectedArea before the action.
         * @param  {SelectedArea} newSelection      the SelectedArea after the action.
         * @return {[type]}                         returns nothing, works by side-effect.
         *
         * @author Josselin GIET
         */
        saveInHistory(previousSelection, newSelection) {
            EventManager_1.EventManager.spawnEvent("rubens_historySaveStep", new HistoryStep_1.EditSelectionStep(this.name, previousSelection, newSelection));
        }
    }
    exports.MagicWandTool = MagicWandTool;
});