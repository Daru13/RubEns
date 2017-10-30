import { Tool } from "./Tool";

/**
 * Tool used to select the whole image.
 * When selecting the tool, the whole image is selected.
 */
export class SelectEverythingTool extends Tool {

    /**
     * The name of the tool.
     * This information may for instance be used by the UI.
     */
    readonly name = "Select everything";

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
            selector: "canvas",
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
        this.applySelection();
    }

    /**
     * Select the whole image, and change the workspace.
     *
     * @author Mathieu Fehr
     */
    applySelection() {
        this.workspace.selectedArea.data.fill(255);
        this.workspace.displaySelection(this.workspace.selectedArea);
    }
}
