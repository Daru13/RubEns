import { Tool } from "./Tool";


/**
 * Tool used to select an area that has the same color.
 * The user click on a pixel, and the zone with the same color is selected.
 */
export class BucketTool extends Tool {

    /**
     * Name given to the tool.
     * This is the name displayed in the UI
     */
    readonly name = "Fill area";

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
     * Will select the adjacent area that has the same color than the pixel selected.
     *
     * @author Mathieu Fehr
     */
    onMouseDown(event: MouseEvent) {
        let imageData = new ImageData(this.workspace.width, this.workspace.height);

        // temporary
        let randomColorR = Math.random() * 255;
        let randomColorG = Math.random() * 255;
        let randomColorB = Math.random() * 255;

        this.workspace.selectedArea.data.forEach((value, index, array) => {
           if(value !== 0) {
               imageData.data[4 * index    ] = randomColorR;
               imageData.data[4 * index + 1] = randomColorG;
               imageData.data[4 * index + 2] = randomColorB;
               imageData.data[4 * index + 3] = 255;
           }
        });

        this.workspace.workingCanvas.setImageData(imageData);
        this.workspace.applyWorkingCanvas();
    }
}

