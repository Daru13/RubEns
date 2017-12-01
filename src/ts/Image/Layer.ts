import { Canvas } from "./Canvas";


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
     * @param {number} height   The height of the layer
     * @param {number} width    The width of the layer
     */
    constructor(width: number, height: number) {
        this.canvas = new Canvas(width,height);
        this.fusionMode = FusionMode.Addition;
    }
}