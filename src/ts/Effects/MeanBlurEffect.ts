import { Effect, EffectParameters } from "./Effect";
import * as Params from "../Parameter";
import { Convolution } from "../DrawingPrimitives/Convolution";
import { EventManager } from "../EventManager";
import { EditLayerStep } from "../HistoryStep";

/**
 * Set of parameters used by [[MeanBlurEffect]].
 * Default values of those parameters are defined in the class implementation.
 */
export class MeanBlurParameters implements EffectParameters {
    kernelSize: Params.NumberParameter = {
        kind: Params.ParameterKind.Number,
        value: 3,
        name: "Kernel size",
        min: 1,
        max: 31,
        step: 2
    };
}

/**
 * Effect that apply a mean blur to the selected layer.
 */
export class MeanBlurEffect extends Effect {

    /**
     * Name of the effect
     */
    readonly name = "Mean Blur";

    /**
     * Set of parameters for this effect.
     */
    parameters: MeanBlurParameters;

    /**
     * Constructor initializing parameters.
     */
    constructor() {
        super();
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
        let horizontalKernel = Convolution.createMeanKernel(1,size);
        let verticalKernel = Convolution.createMeanKernel(size,1);
        Convolution.convolve(horizontalKernel, imageData);
        Convolution.convolve(verticalKernel, imageData);

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
    saveInHistory(previousImageData: ImageData, newImageData: ImageData){
        EventManager.spawnEvent(
            "rubens_historySaveStep",
            new EditLayerStep(this.name, previousImageData, newImageData,this.workspace.drawingLayers.selectedLayer.id)
        )
    }
}
