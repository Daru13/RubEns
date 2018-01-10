import { Effect, EffectParameters } from "./Effect";
import * as Params from "../Parameter";
import { Convolution } from "../DrawingPrimitives/Convolution";


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
        let imageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();

        let kernel = Convolution.createMeanKernel(Math.round(this.parameters.kernelSize.value));
        Convolution.convolve(kernel, imageData);

        this.workspace.drawingLayers.selectedLayer.canvas.setImageData(imageData);
    }
}
