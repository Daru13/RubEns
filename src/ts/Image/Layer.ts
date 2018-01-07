import { Canvas } from "./Canvas";
import { EventManager } from "../EventManager";


/**
 * All the available blend modes for layers.
 */
export enum BlendModes {
    Normal    = "Normal",
    Add       = "Add",
    Subtract  = "Subtract",
    Multiply  = "Multiply"

    // TODO: add more
}


/**
 * Represent a layer in an document.
 * Internally, it is represented by a canvas, not visible by the user.
 */
export class Layer {

    /**
     * The canvas containing the data of the layer.
     */
    canvas: Canvas;

    /**
     * The blend mode used by the layer.
     */
    blendMode: BlendModes;

    /**
     * The name of the layer.
     */
    name: string;

    /**
     * The id of the layer.
     */
    readonly id: number;

    /**
     * Flag indicating whether the layer must be hidden or not.
     */
    hidden: boolean;


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
        this.name   = name;
        this.id     = id;

        this.blendMode = BlendModes.Normal;
        this.hidden    = false;
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
        if (this.hidden) {
            return;
        }

        // In this function, we will check the blend mode
        switch (this.blendMode) {
            default: // TODO: implement other blend modes

            case BlendModes.Normal:
                canvas.drawCanvas(this.canvas);
                break;
        }
    }
}
