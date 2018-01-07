import { Tool } from "./Tool";
import {Convolution} from "../DrawingPrimitives/Convolution";

/**
 * Tool used to apply an effect on the current layer.
 * When selecting the tool, the whole image is selected.
 */
export class EffectTool extends Tool {

    /**
     * The name of the tool.
     * This information may for instance be used by the UI.
     */
    readonly name = "Apply Effect";

    /**
     * Instantiates the object, and add the event handlers to the eventManager.
     *
     * @author Mathieu Fehr
     */
    constructor () {
        super();
        this.initEventHandlers();
    }


    /**
     * Setup the event handlers.
     *
     * @author Mathieu Fehr
     */
    initEventHandlers() {
        // Add the event handlers to the event manager
        this.eventHandlers.push({
            eventTypes: ["mousedown"],
            selector: "#drawing_display",
            callback: (event) => this.onMouseDown(<MouseEvent> event)

        });
    }


    /**
     * The action made when the user clicks in the drawing canvas.
     *
     * @param event The event
     *
     * @author Mathieu Fehr
     */
    onMouseDown(event: MouseEvent) {
        this.applyEffect();
    }

    /**
     * Select the whole image, and change the workspace.
     *
     * @author Mathieu Fehr
     */
    applyEffect() {
        let imageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();
        let kernel = Convolution.createSharpenKernel(5, 0.5);
        Convolution.convolve(kernel, imageData);
        this.workspace.drawingLayers.selectedLayer.canvas.setImageData(imageData);
        this.workspace.redrawDrawingLayers();
    }
}
