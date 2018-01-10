import { Effect, EffectParameters } from "./Effect";
import * as Params from "../Parameter";
import { Convolution } from "../DrawingPrimitives/Convolution";


/**
 * Set of parameters used by [[SharpenEffect]].
 * Default values of those parameters are defined in the class implementation.
 */
export class SharpenParameters implements EffectParameters {
    sigma: Params.NumberParameter = {
        kind: Params.ParameterKind.Number,
        value: 1,
        name: "Standard deviation",
        min: 1,
        max: 31,
        step: 1
    };
}

/**
 * Effect that apply a sharpen effect to the selected layer.
 */
export class SharpenEffect extends Effect {

    /**
     * Name of the effect
     */
    readonly name = "Sharpen";

    /**
     * Set of parameters for this effect.
     */
    parameters: SharpenParameters;

    /**
     * Constructor initializing parameters.
     */
    constructor() {
        super();
        this.parameters = new SharpenParameters();
    }

    /**
     * Apply the effect on the current layer.
     *
     * @author Mathieu Fehr
     */
    apply() {
        let imageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();

        let kernel = Convolution.createSharpenKernel(Math.round(this.parameters.sigma.value));
        Convolution.convolve(kernel, imageData);

        this.workspace.drawingLayers.selectedLayer.canvas.setImageData(imageData);
    }
}
