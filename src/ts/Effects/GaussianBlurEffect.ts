import { Effect, EffectParameters } from "./Effect";
import * as Params from "../Parameter";
import { Convolution } from "../DrawingPrimitives/Convolution";


/**
 * Set of parameters used by [[GrayscaleEffect]].
 * Default values of those parameters are defined in the class implementation.
 */
export class GaussianBlurParameters implements EffectParameters {
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
 * Effect that apply a gaussian blur to the selected layer.
 */
export class GaussianBlurEffect extends Effect {

    /**
     * Name of the effect
     */
    readonly name = "Gaussian Blur";

    /**
     * Set of parameters for this effect.
     */
    parameters: GaussianBlurParameters;

    /**
     * Constructor initializing parameters.
     */
    constructor() {
        super();
        this.parameters = new GaussianBlurParameters();
    }

    /**
     * Apply the effect on the current layer.
     *
     * @author Mathieu Fehr
     */
    apply() {
        let imageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();

        let sigma = this.parameters.sigma.value;
        let size = Convolution.getGaussianKernelSize(sigma);

        // We do two simple convolutions instead of one to improve performances
        let horizontalKernel = Convolution.createGaussianKernel(sigma, size, 1);
        let verticalKernel = Convolution.createGaussianKernel(sigma, 1, size);
        Convolution.convolve(horizontalKernel, imageData);
        Convolution.convolve(verticalKernel, imageData);

        this.workspace.drawingLayers.selectedLayer.canvas.setImageData(imageData);
    }
}
