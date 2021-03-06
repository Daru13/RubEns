import { Effect, EffectParameters } from "./Effect";
import * as Params from "../Parameter";
import { Convolution } from "../DrawingPrimitives/Convolution";
import { EventManager } from  "../EventManager";
import { EditLayerStep } from "../HistoryStep";

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
        let previousImageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
        let imageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();

        let sigma = this.parameters.sigma.value;
        let size = Convolution.getGaussianKernelSize(sigma);

        // We do two simple convolutions instead of one to improve performances
        let horizontalKernel = Convolution.createGaussianKernel(sigma, size, 1);
        let verticalKernel = Convolution.createGaussianKernel(sigma, 1, size);
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
