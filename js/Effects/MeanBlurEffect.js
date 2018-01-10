define(["require", "exports", "./Effect", "../Parameter", "../DrawingPrimitives/Convolution", "../EventManager", "../HistoryStep"], function (require, exports, Effect_1, Params, Convolution_1, EventManager_1, HistoryStep_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Set of parameters used by [[MeanBlurEffect]].
     * Default values of those parameters are defined in the class implementation.
     */
    class MeanBlurParameters {
        constructor() {
            this.kernelSize = {
                kind: Params.ParameterKind.Number,
                value: 3,
                name: "Kernel size",
                min: 1,
                max: 31,
                step: 2
            };
        }
    }
    exports.MeanBlurParameters = MeanBlurParameters;
    /**
     * Effect that apply a mean blur to the selected layer.
     */
    class MeanBlurEffect extends Effect_1.Effect {
        /**
         * Constructor initializing parameters.
         */
        constructor() {
            super();
            /**
             * Name of the effect
             */
            this.name = "Mean Blur";
            this.parameters = new MeanBlurParameters();
        }
        /**
         * Apply the effect on the current layer.
         *
         * @author Mathieu Fehr
         */
        apply() {
            let previousImageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            let imageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
            let size = Math.round(this.parameters.kernelSize.value);
            // We do two simple convolutions instead of one to improve performances
            let horizontalKernel = Convolution_1.Convolution.createMeanKernel(1, size);
            let verticalKernel = Convolution_1.Convolution.createMeanKernel(size, 1);
            Convolution_1.Convolution.convolve(horizontalKernel, imageData);
            Convolution_1.Convolution.convolve(verticalKernel, imageData);
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
    exports.MeanBlurEffect = MeanBlurEffect;
});
