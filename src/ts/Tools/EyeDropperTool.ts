import { Tool } from "./Tool";
import {Color} from "../utils/Color";


/**
 * Tool used to select the color of the image pointed by the mouse.
 */
export class EyeDropperTool extends Tool {

    /**
     * Name given to the tool.
     * This is the name displayed in the UI
     */
    readonly name = "Eye Dropper";

    /**
     * Basic constructor.
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
            selector: "canvas",
            callback: (event) => this.onMouseDown(<MouseEvent> event)

        });
    }


    /**

     * The action made when the user click.
     * Will select the color of the pixel pointed by the mouse on the image.
     *
     * @author Mathieu Fehr
     */
    onMouseDown(event: MouseEvent) {
        let point = this.workspace.getMouseEventCoordinates(event);

        let imageData = this.workspace.drawingCanvas.getImageData();

        let position = Math.round(point.x) + imageData.width * Math.round(point.y);
        let red = imageData.data[4 * position];
        let green = imageData.data[4 * position + 1];
        let blue = imageData.data[4 * position + 2];
        let alpha = imageData.data[4 * position + 3];

        let color = new Color(red, green, blue, alpha);
        this.documentParameters.sharedToolParameters.mainColor.value = color.getHex();
    }

}
