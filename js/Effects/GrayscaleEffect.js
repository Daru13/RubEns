define(["require", "exports", "./Effect", "../DrawingPrimitives/ColorEffects", "../Parameter", "../EventManager", "../HistoryStep"], function (require, exports, Effect_1, ColorEffects_1, Params, EventManager_1, HistoryStep_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The different types of grayscale
     */
    var GrayscaleType;
    (function (GrayscaleType) {
        GrayscaleType["Average"] = "Average";
        GrayscaleType["Lightness"] = "Lightness";
        GrayscaleType["Luminosity"] = "Luminosity";
    })(GrayscaleType || (GrayscaleType = {}));
    /**
     * Set of parameters used by [[GrayscaleEffect]].
     * Default values of those parameters are defined in the class implementation.
     */
    class GrayscaleParameters {
        constructor() {
            this.grayscaleType = {
                kind: Params.ParameterKind.OptionList,
                value: GrayscaleType[0],
                name: "Grayscale type",
                options: Object.keys(GrayscaleType).map(key => { return GrayscaleType[key]; }),
            };
        }
    }
    exports.GrayscaleParameters = GrayscaleParameters;
    /**
     * Effect that does a grayscale conversion of the current layer.
     */
    class GrayscaleEffect extends Effect_1.Effect {
        /**
         * Constructor initializing parameters.
         */
        constructor() {
            super();
            /**
             * Name of the effect
             */
            this.name = "Convert Grayscale";
            this.parameters = new GrayscaleParameters();
        }
        /**
         * Apply the effect on the current layer.
         *
         * @author Mathieu Fehr
         */
        apply() {
            let previousImageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            let imageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            switch (this.parameters.grayscaleType.value) {
                case GrayscaleType.Average:
                    ColorEffects_1.ColorEffects.toGrayscaleWithAverage(imageData);
                    break;
                case GrayscaleType.Lightness:
                    ColorEffects_1.ColorEffects.toGrayscaleWithLightness(imageData);
                    break;
                case GrayscaleType.Luminosity:
                    ColorEffects_1.ColorEffects.toGrayscaleWithLuminosity(imageData);
                    break;
            }
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
        saveInHistory(previousImageData, newImageData) {
            EventManager_1.EventManager.spawnEvent("rubens_historySaveStep", new HistoryStep_1.EditLayerStep(this.name, previousImageData, newImageData, this.workspace.drawingLayers.selectedLayer.id));
        }
    }
    exports.GrayscaleEffect = GrayscaleEffect;
});
