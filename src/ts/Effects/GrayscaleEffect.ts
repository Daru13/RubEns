import { Effect, EffectParameters } from "./Effect";
import { ColorEffects } from "../DrawingPrimitives/ColorEffects";
import * as Params from "../Parameter";
import { EventManager } from  "../EventManager";
import { EditLayerStep } from "../HistoryStep";

/**
 * The different types of grayscale
 */
enum GrayscaleType {
    Average = "Average",
    Lightness = "Lightness",
    Luminosity = "Luminosity"
}


/**
 * Set of parameters used by [[GrayscaleEffect]].
 * Default values of those parameters are defined in the class implementation.
 */
export class GrayscaleParameters implements EffectParameters {
    grayscaleType: Params.OptionListParameter = {
        kind: Params.ParameterKind.OptionList,
        value: GrayscaleType[0],
        name: "Grayscale type",
        options: Object.keys(GrayscaleType).map(key => { return GrayscaleType[key]; }),
    };
}


/**
 * Effect that does a grayscale conversion of the current layer.
 */
export class GrayscaleEffect extends Effect {

    /**
     * Name of the effect
     */
    readonly name = "Convert Grayscale";

    /**
     * Set of parameters for this effect.
     */
    parameters: GrayscaleParameters;

    /**
     * Constructor initializing parameters.
     */
    constructor() {
        super();
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

        switch(this.parameters.grayscaleType.value) {
            case GrayscaleType.Average:
                ColorEffects.toGrayscaleWithAverage(imageData);
                break;
            case GrayscaleType.Lightness:
                ColorEffects.toGrayscaleWithLightness(imageData);
                break;
            case GrayscaleType.Luminosity:
                ColorEffects.toGrayscaleWithLuminosity(imageData);
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
    saveInHistory(previousImageData: ImageData, newImageData: ImageData){
        EventManager.spawnEvent(
            "rubens_historySaveStep",
            new EditLayerStep(this.name, previousImageData, newImageData,this.workspace.drawingLayers.selectedLayer.id)
        )
    }
}
