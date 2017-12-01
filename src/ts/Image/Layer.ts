import { Canvas } from "./Canvas";
import { EventManager } from "../EventManager";


/**
 * The different fusion mode for layers.
 */
enum FusionMode {
    Addition,       /** Add the canvas on the other one */
}


/**
 * Represent a layer for an image.
 * Internally, it is represented by a canvas, not visible by the user.
 */
class Layer {

    /**
     * The canvas containing the data of the layer.
     */
    private canvas: Canvas;

    /**
     * The fusion mode used by the later.
     */
    private fusionMode: FusionMode;


    /**
     * Create a new layer with given height and width.
     *
     * @param {number} height               The height of the layer.
     * @param {number} width                The width of the layer.
     * @param {EventManager} eventManager   The event handler.
     * @param {string} name                 The name of the layer.
     *
     * @author Mathieu Fehr
     */
    constructor(width: number, height: number, eventManager: EventManager, name: string) {
        this.canvas = new Canvas(width,height, eventManager);
        this.fusionMode = FusionMode.Addition;
    }


    /**
     * Draw the layer on a canvas of the same size.
     *
     * @param {Canvas} canvas   The canvas used to draw the layer.
     *
     * @author Mathieu Fehr
     */
    drawOnCanvas(canvas: Canvas) {
        // In this function, we will check the fusion mode
        switch(this.fusionMode) {
            case FusionMode.Addition:
                canvas.drawCanvas(this.canvas);
                break;
        }
    }
}