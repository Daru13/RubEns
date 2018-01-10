import { Tool } from "./Tool";


/**
 * Tool used to zoom in the image.
 */
export class ZoomInTool extends Tool {

    /**
     * Name given to the tool.
     * This is the name displayed in the UI
     */
    readonly name = "Zoom in";

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
            selector: "#drawing_display",
            callback: (event) => this.onMouseDown(<MouseEvent> event)

        });
    }


    /**
     * The action made when the user click.
     * The zoom will increase in the image.
     *
     * @author Mathieu Fehr
     */
    onMouseDown(event: MouseEvent) {
        this.workspace.zoomIn();
    }

}
