import { Tool } from "./Tool";
import { SelectedArea } from "../Image/SelectedArea";
import { Point } from "../utils/Point";
import { EventManager } from "../EventManager";
import { EditSelectionStep } from "../HistoryStep";

/**
 * Tool used to select an area that has the same color.
 * The user click on a pixel, and the zone with the same color is selected.
 */
export class MagicWandTool extends Tool {

    /**
     * Name given to the tool.
     * This is the name displayed in the UI
     */
    readonly name = "Magic Wand";

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

        // The area selected is the one with the same color as the source pixel.
        let source = this.workspace.getMouseEventCoordinates(event);
        source.x = Math.round(source.x);
        source.y = Math.round(source.y);

        // The height and with of the image
        let imageHeight = this.workspace.height;
        let imageWidth = this.workspace.width;

        let previousSelection = this.workspace.selectedArea;

        let selectedArea = new SelectedArea(imageWidth, imageHeight);

        if(this.workspace.drawingLayers.selectedLayer === null) {
            return;
        }
        let imageData = this.workspace.drawingLayers.selectedLayer.canvas.getImageData();

        // The color of the source pixel
        let r = imageData.data[4 * (source.x + imageWidth * source.y)    ];
        let g = imageData.data[4 * (source.x + imageWidth * source.y) + 1];
        let b = imageData.data[4 * (source.x + imageWidth * source.y) + 2];
        let a = imageData.data[4 * (source.x + imageWidth * source.y) + 3];

        let stack = [source];

        // We do a simple DFS to select the area with the same color
        while(stack.length > 0) {
            let pixel = stack.pop();

            // We check the pixel is in the image bound
            if(pixel.x === -1 || pixel.x === imageWidth || pixel.y === -1 || pixel.y === imageHeight) {
                continue;
            }
            let offset = (pixel.x + imageWidth * pixel.y);

            // If the pixel has already been set, we can continue
            if(selectedArea.data[offset] === 255) {
                continue;
            }

            // If the pixel has the same color as the source, we add it to the selection,
            // and add its neighbors.
            if(imageData.data[4 * offset    ] === r && imageData.data[4 * offset + 1] === g &&
               imageData.data[4 * offset + 2] === b && imageData.data[4 * offset + 3] === a) {

                selectedArea.data[offset] = 255;

                stack.push(new Point(pixel.x - 1, pixel.y    ));
                stack.push(new Point(pixel.x + 1, pixel.y    ));
                stack.push(new Point(pixel.x    , pixel.y - 1));
                stack.push(new Point(pixel.x    , pixel.y + 1));
            }
        }

        this.workspace.selectedArea = selectedArea;
        this.workspace.displaySelection();

        this.saveInHistory(previousSelection, selectedArea);
    }

    saveInHistory (previousSelection: SelectedArea, newSelection: SelectedArea){
        EventManager.spawnEvent(
            "rubens_historySaveStep",
            new EditSelectionStep(this.name, previousSelection, newSelection)
        )
    }
}
