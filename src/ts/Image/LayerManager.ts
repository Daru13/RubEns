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
    private lastId: number = -1;


    /**
     * Construct a new layerManager
     *
     * @param {number} width                The width of the layer manager.
     * @param {number} height               The height of the layer manager.
     * @param {EventManager} eventManager   The eventManager used to dispatch events to layers.
     *
     * @author Mathieu Fehr
     */
    constructor(width: number, height: number, eventManager: EventManager) {
        this.width = width;
        this.height = height;
        this.eventManager = eventManager;

        eventManager.registerEventHandler(this.documentResizedHandler);
    }

    /**
     * Returns the index of the layer with the given id, or -1 if it is not found.
     * @param  {number} id The id of the layer to search.
     * @return {number}    The index of the layer with the given id, or -1.
     *
     * @author Camille Gobert
     */
    private getLayerIndexFromId (id: number) {
        return this.layers.findIndex((layer: Layer) => { return layer.id === id; });
    }


    /**
     * Delete a layer, given its id.
     *
     * @param {number} id   The id of the layer to delete
     *
     * @author Mathieu Fehr
     */
    deleteLayer (id: number) {
        let layerIndex = this.getLayerIndexFromId(id);
        if (layerIndex >= 0) {
            this.layers.splice(layerIndex, 1);

            if (this.layers.length === 0) {
                this.selectedLayer = null;
            } else {
                this.selectedLayer = this.layers[Math.max(0, layerIndex - 1)];
            }

            EventManager.spawnEvent("rubens_deleteLayer");
        }
    }


    /**
     * Delete the currently selected layer.
     *
     * @author Camille Gobert
     */
    deleteSelectedLayer () {
        this.deleteLayer(this.selectedLayer.id);
    }


    /**
     * Create a new layer at the top of the layer list
     *
     * @param {string} name The name of the new layer
     *
     * @author Mathieu Fehr
     */
    createLayer(name = "New Layer") {
        this.lastId += 1;
        name += "(" + this.lastId + ")";

        if(this.selectedLayer == null) {
            this.selectedLayer = new Layer(this.width, this.height, this.eventManager, name, this.lastId);
            this.layers.push(this.selectedLayer);
        } else {
            let position = this.layers.findIndex((value: Layer) => {
                return this.selectedLayer === value;
            });
            this.selectedLayer = new Layer(this.width, this.height, this.eventManager, name, this.lastId);
            this.layers.splice(position, 0, this.selectedLayer);
        }

        EventManager.spawnEvent("rubens_addLayer");
    }


    /**
     * Change the position of a layer.
     *
     * @param {number} id           The id of the layer.
     * @param {number} nextPosition The new position of the layer.
     *
     * @author Mathieu Fehr
     */
    moveLayer(id: number, nextPosition: number) {
        if(nextPosition < 0) {
            console.error("The new position of the layer should be positive");
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
     * Move the currently selected layer up.
     *
     * @author Camille Gobert
     */
    moveSelectedLayerUp () {
        // Moving up means going down in the index space
        let selectedLayerIndex = this.getLayerIndexFromId(this.selectedLayer.id);
        let nextPosition = Math.max(selectedLayerIndex - 1, 0);

        this.moveLayer(this.selectedLayer.id, nextPosition);
    }


    /**
     * Move the currently selected layer down.
     *
     * @author Camille Gobert
     */
    moveSelectedLayerDown () {
        // Moving down means going up in the index space
        let selectedLayerIndex = this.getLayerIndexFromId(this.selectedLayer.id);
        let nextPosition = Math.min(selectedLayerIndex + 1, this.layers.length - 1);

        this.moveLayer(this.selectedLayer.id, nextPosition);
    }


    /**
     * Select a layer given its id.
     * If there is no layer with such id, the selected layer is not changed.
     *
     * @param {number} id   The id of the layer.
     *
     * @author Mathieu Fehr
     */
    selectLayer(id: number) {
        let index = this.layers.findIndex((layer: Layer) => {
            return id === layer.id;
        });

        if(index !== -1) {
            this.selectedLayer = this.layers[index];

            EventManager.spawnEvent("rubens_selectLayer");
        }
    }


    /**
     * Draw all the layers on the given canvas.
     *
     * @param {Canvas} canvas The canvas where the layers should be drawn.
     *
     * @author Mathieu Fehr
     */
    drawOn(canvas: Canvas) {
        for(let i = this.layers.length-1; i>=0; i--) {
            this.layers[i].drawOnCanvas(canvas);
        }
    }
}
