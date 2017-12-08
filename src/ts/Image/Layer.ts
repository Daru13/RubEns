import { Canvas } from "./Canvas";
import { EventManager } from "../EventManager";


/**
 * The different fusion mode for layers.
 */
enum FusionMode {
    Blend,       /** Add the canvas on the other one */
}


/**
 * Represent a layer for an image.
 * Internally, it is represented by a canvas, not visible by the user.
 */
export class Layer {

    /**
     * The canvas containing the data of the layer.
     */
    canvas: Canvas;

    /**
     * The fusion mode used by the later.
     */
    fusionMode: FusionMode = FusionMode.Blend;

    /**
     * The name of the layer.
     */
    name: string;

    /**
     * The id of the layer
     */
    readonly id: number;

    /**
     * Boolean indicating if the layer needs to be displayed or not.
     */
    isActive: boolean = true;


    /**
     * Create a new layer with given height and width.
     *
     * @param {number} height               The height of the layer.
     * @param {number} width                The width of the layer.
     * @param {EventManager} eventManager   The event handler.
     * @param {string} name                 The name of the layer.
     * @param {number} id                   The id of the layer.
     *
     * @author Mathieu Fehr
     */
    constructor(width: number, height: number, eventManager: EventManager, name: string, id: number) {
        this.canvas = new Canvas(width,height, eventManager);
        this.name = name;
        this.id = id;
    }


    /**
     * Draw the layer on a canvas of the same size if the
     *
     * @param {Canvas} canvas   The canvas used to draw the layer.
     *
     * @author Mathieu Fehr
     */
    drawOnCanvas(canvas: Canvas) {
        // We first check if we need to draw the layer
        if(!this.isActive) {
            return;
        }

        // In this function, we will check the fusion mode
        switch(this.fusionMode) {
            case FusionMode.Blend:
                canvas.drawCanvas(this.canvas);
                break;
        }
    }
}