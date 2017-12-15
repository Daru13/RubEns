import { Layer } from "./Layer";
import { EventManager } from "../EventManager";
import {Canvas} from "./Canvas";

/**
 * Canvas composed by multiple layers.
 * This is used to have an image composed of multiple layers.
 */
export class LayerManager {

    /**
     * The width of the layers in the layer manager
     */
    private width: number;

    /**
     * The height of the layers in the layer manager
     */
    private height: number;

    /**
     * The layers composing the canvas
     */
    layers: Array<Layer> = [];

    /**
     * Selected layer
     */
    selectedLayer: Layer;


    /**
     * Event handler for document resize.
     */
    protected documentResizedHandler = {
        eventTypes: ["rubens_documentResized"],
        callback  : (event) => {
            this.width  = event.detail.newWidth;
            this.height = event.detail.newHeight;
        }
    };

    /**
     * The event manager used to dispatch events
     */
    private eventManager: EventManager;

    /**
     * The last id used to create a layer
     */
    private lastId: number = 0;


    /**
     * Construct a new layerManager
     *
     * @param {number} width                The width of the layer manager.
     * @param {number} height               The height of the layer manager.
     * @param {EventManager} eventManager   The eventManager used to dispatch events to layers.
     */
    constructor(width: number, height: number, eventManager: EventManager) {
        this.width = width;
        this.height = height;
        this.eventManager = eventManager;

        eventManager.registerEventHandler(this.documentResizedHandler);
    }


    /**
     * Delete a layer, given its id
     *
     * @param {number} id   The id of the layer to delete
     */
    deleteLayer(id: number) {
        this.layers.filter((value: Layer) => {
            return id !== value.id;
        });

        // We change the selected layer if necessary
        if(this.selectedLayer.id === id) {
            if(this.layers.length === 0) {
                this.selectedLayer = null;
            } else {
                this.selectedLayer = this.layers[0];
            }
        }
    }


    /**
     * Create a new layer at the top of the layer list
     *
     * @param {string} name The name of the new layer
     */
    createLayer(name = "New Layer") {
        this.lastId += 1;

        if(this.selectedLayer == null) {
            this.selectedLayer = new Layer(this.width, this.height, this.eventManager, name, this.lastId);
            this.layers.push(this.selectedLayer);
        } else {
            let position = this.layers.findIndex((value: Layer) => {
                return this.selectedLayer === value;
            });
            this.selectedLayer = new Layer(this.width, this.height, this.eventManager, name, this.lastId);
            this.layers.splice(position, 0, )
        }
    }


    /**
     * Change the position of a layer.
     *
     * @param {number} id           The id of the layer.
     * @param {number} nextPosition The new position of the layer.
     */
    moveLayer(id: number, nextPosition: number) {
        if(nextPosition < 0) {
            console.error("The new posiiton of the layer should be positive");
            nextPosition = 0;
        } else if(nextPosition >= this.layers.length) {
            console.error("The new position of the layer should be less than the number of layers");
            nextPosition = this.layers.length - 1;
        }

        let layer = this.layers.find((value: Layer) => {
            return value.id === id;
        });

        this.layers.filter((value: Layer) => {
            return value.id !== id;
        });

        this.layers.splice(nextPosition, 0, layer);
    }


    /**
     * Draw all the layers on the given canvas.
     *
     * @param {Canvas} canvas The canvas where the layers should be drawn.
     */
    drawOn(canvas: Canvas) {
        for(let i = this.layers.length-1; i>=0; i--) {
            this.layers[i].drawOnCanvas(canvas);
        }
    }
}