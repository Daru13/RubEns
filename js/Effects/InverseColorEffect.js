define(["require", "exports", "./Effect", "../DrawingPrimitives/ColorEffects", "../EventManager", "../HistoryStep"], function (require, exports, Effect_1, ColorEffects_1, EventManager_1, HistoryStep_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InverseColorEffect extends Effect_1.Effect {
        constructor() {
            super(...arguments);
            /**
             * The name of the effect.
             * This information may for instance be used by the UI.
             */
            this.name = "Inverse colors";
        }
        /**
         * Inverse the color of the current layer.
         *
         * @author Mathieu Fehr
         */
        apply() {
            // We check that there is a selected layer.
            if (this.workspace.drawingLayers.selectedLayer === null) {
                return;
            }
            let previousImageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            // And we apply the effect
            let imageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            ColorEffects_1.ColorEffects.inverseColors(imageData);
            this.workspace.drawingLayers.selectedLayer.canvas.setImageData(imageData);
            this.saveInHistory(previousImageData, imageData);
        }
        /**
         * This function save the applied effect in the history.
         *
         * @param  {ImageData} previousImageData the ImageData before the effect is applied.
         * @param  {ImageData} newImageData      the ImageData after the effect is applied.
         * @return {void}                      Returns nothing, works by side-effect.
         *
         * @author Josselin GIET
         */
        // TODO : involution trivial to optimise (a little GenericHistoryStep should be enough !)
        saveInHistory(previousImageData, newImageData) {
            EventManager_1.EventManager.spawnEvent("rubens_historySaveStep", new HistoryStep_1.EditLayerStep(this.name, previousImageData, newImageData, this.workspace.drawingLayers.selectedLayer.id));
        }
    }
    exports.InverseColorEffect = InverseColorEffect;
});
