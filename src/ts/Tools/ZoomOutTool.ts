import { Tool } from "./Tool";


/**
 * Tool used to zoom out of the image.
 */
export class ZoomOutTool extends Tool {

    /**
     * Name given to the tool.
     * This is the name displayed in the UI
     */
    readonly name = "Test2";

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
     * The zoom will decrease in the image.
     *
     * @author Mathieu Fehr
     */
    onMouseDown(event: MouseEvent) {
        this.workspace.zoomOut();
    }

}
