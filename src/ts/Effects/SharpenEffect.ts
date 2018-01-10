import { Effect, EffectParameters } from "./Effect";
import * as Params from "../Parameter";
import { Convolution } from "../DrawingPrimitives/Convolution";
import { EventManager } from "../EventManager";
import { EditLayerStep } from "../HistoryStep";

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
        let imageData1 = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
        let imageData2 = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();

        let size = Convolution.getGaussianKernelSize(this.parameters.sigma.value);
        let horizontalKernel = Convolution.createGaussianKernel(this.parameters.sigma.value, size, 1);
        let verticalKernel = Convolution.createGaussianKernel(this.parameters.sigma.value, 1, size);
        Convolution.convolve(horizontalKernel, imageData1);
        Convolution.convolve(verticalKernel, imageData1);

        for (let index = 0; index < imageData1.data.length; index += 4) {
            let red1   = imageData1.data[index];
            let green1 = imageData1.data[index + 1];
            let blue1  = imageData1.data[index + 2];
            let alpha1 = imageData1.data[index + 3];

            let red2   = imageData2.data[index];
            let green2 = imageData2.data[index + 1];
            let blue2  = imageData2.data[index + 2];
            let alpha2 = imageData2.data[index + 3];

            let newAlpha = Math.max(0, Math.min(255, Math.round(2 * alpha2 - alpha1)));
            let newRed   = Math.max(0, Math.min(255, Math.round((2 * red2 * alpha2 - red1 * alpha1) / newAlpha)));
            let newGreen = Math.max(0, Math.min(255, Math.round((2 * green2 * alpha2 - green1 * alpha1) / newAlpha)));
            let newBlue  = Math.max(0, Math.min(255, Math.round((2 * blue2 * alpha2 - blue1 * alpha1) / newAlpha)));

            imageData1.data[index]     = newRed;
            imageData1.data[index + 1] = newGreen;
            imageData1.data[index + 2] = newBlue;
            imageData1.data[index + 3] = newAlpha;
        }

        this.workspace.drawingLayers.selectedLayer.canvas.setImageData(imageData1);
        this.saveInHistory(imageData2, imageData1);
    }

    /**
     * This function save the drawn shape in the history.
     * @return {[type]} [description]
     */
    saveInHistory(previousImageData: ImageData, newImageData: ImageData){
        EventManager.spawnEvent(
            "rubens_historySaveStep",
            new EditLayerStep(this.name, previousImageData, newImageData,this.workspace.drawingLayers.selectedLayer.id)
        )
    }
}
