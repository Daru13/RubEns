import { Tool } from "./Tool";
import { Color } from "../utils/Color";
import { EventManager } from "../EventManager";
import { EditLayerStep } from "../HistoryStep";

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
            selector: "#drawing_display",
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

        let previousImageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();

        this.workspace.selectedArea.data.forEach((value, index, array) => {

            let color = Color.buildFromHex(this.documentParameters.sharedToolParameters.mainColor.value);

            if(value !== 0) {
                imageData.data[4 * index    ] = color.red;
                imageData.data[4 * index + 1] = color.green;
                imageData.data[4 * index + 2] = color.blue;
                imageData.data[4 * index + 3] = color.alpha;
            }
        });

        this.workspace.workingCanvas.setImageData(imageData);
        this.workspace.applyWorkingCanvas();

        this.saveInHistory(previousImageData, imageData);
    }

    /**
     * This function save the drawn shape in the history.
     * @return {[type]} [description]
     */
    saveInHistory(previousImageData: ImageData, newImageData: ImageData){
        EventManager.spawnEvent(
            "rubens_historySaveStep",
            new EditLayerStep(this.name, previousImageData, newImageData,this.workspace.drawingLayers.selectedLayer.id)
        )
    }
}
