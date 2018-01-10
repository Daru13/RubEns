define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GenericHistoryStep {
        /**
         * Basic constructor
         * @param  {string}          description A short description of the action.
         * @param  {HistoryFunction} redo        A function that reapplies the action.
         * @param  {HistoryFunction} undo        A function that cancels the action.
         * @return {void}                      Returns nothing, works by side-effect.
         *
         * @author Josselin GIET
         */
        constructor(description, redo, undo) {
            this.type = "GenericHistoryStep";
            this.description = description;
            this.redo = redo;
            this.undo = undo;
        }
    }
    exports.GenericHistoryStep = GenericHistoryStep;
    class EditLayerStep {
        /**
         * basic constructor.
         * @param  {string}    description       A short description of the action.
         * @param  {ImageData} previousImageData The ImageData before the action.
         * @param  {ImageData} newImageData      The ImageData after the action.
         * @param  {number}    layerId           the id of the current selectedLayer.
         * @return {void}                      Returns nothing, works by side-effect.
         *
         * @author Josselin GIET
         */
        constructor(description, previousImageData, newImageData, layerId) {
            this.type = "EditLayerStep";
            this.description = description;
            this.previousImageData = previousImageData;
            this.newImageData = newImageData;
            this.layerId = layerId;
        }
        undo(document) {
            // console.log(this.previousLayer);
            // console.log(this.previousLayer.canvas);
            document.imageWorkspace.drawingLayers.selectedLayer.canvas.setImageData(this.previousImageData);
            document.imageWorkspace.redrawDrawingLayers();
        }
        redo(document) {
            document.imageWorkspace.drawingLayers.selectedLayer.canvas.setImageData(this.newImageData);
            document.imageWorkspace.redrawDrawingLayers();
        }
    }
    exports.EditLayerStep = EditLayerStep;
    class EditSelectionStep {
        /**
         * basic constructor
         * @param  {string}       description       A short description of the action.
         * @param  {SelectedArea} previousSelection The selectedArea before the action.
         * @param  {SelectedArea} newSelection      The selectedArea after the action.
         * @return {void}                         Returns nothing, works by side-effect.
         *
         * @author Josselin GIET
         */
        constructor(description, previousSelection, newSelection) {
            this.type = "EditSelectionStep";
            this.description = description;
            this.previousSelection = previousSelection;
            this.newSelection = newSelection;
        }
        undo(document) {
            document.imageWorkspace.selectedArea = this.previousSelection;
        }
        redo(document) {
            document.imageWorkspace.selectedArea = this.newSelection;
        }
    }
    exports.EditSelectionStep = EditSelectionStep;
});
//  More to come :
//  - Adding Layer
//  - Merging Layer
