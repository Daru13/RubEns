import { Tool } from "./Tool";
import { SelectedArea } from "../Image/SelectedArea";
import { Point } from "../utils/Point";
import { EventManager } from "../EventManager";
import { EditSelectionStep } from "../HistoryStep";

/**
 * Tool used to draw rectangle selection in the image
 *
 * The user select two points by clicking and then releasing the mouse button, and the
 * selection rectangle will be the rectangle between those two points.
 */
export class RectangleSelectionTool extends Tool {

    /**
     * The name of the tool.
     * This information may for instance be used by the UI.
     */
    readonly name = "Rectangle selector";

    /**
     * The first point (the position of the mouse when the user clicks).
     */
    private firstPoint: Point;

    /**
     * The second point (the position of the mouse when the user releases the mouse button).
     */
    private secondPoint: Point;

    /**
     * Used for saving the SelectedArea before the tool.
     */
    private previousSelection: SelectedArea;

    /**
     * Instantiates the object, and add the event handlers to the eventManager.
     *
     * @author Mathieu Fehr
     */
    constructor () {
        super();
        this.firstPoint = null;
        this.secondPoint = null;

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
        this.eventHandlers.push({
            eventTypes: ["mouseup"],
            selector: "body",
            callback: (event) => this.onMouseUp(<MouseEvent> event)

        });
        this.eventHandlers.push({
            eventTypes: ["mousemove"],
            selector: "body",
            callback: (event) => this.onMouseMove(<MouseEvent> event)

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
        this.previousSelection = this.workspace.selectedArea;
        this.workspace.clearSelection();
        this.firstPoint = this.workspace.getMouseEventCoordinates(event);
        this.firstPoint.x = Math.floor(this.firstPoint.x);
        this.firstPoint.y = Math.floor(this.firstPoint.y);
    }


    /**
     * The action made when the user release the mouse button in the drawing canvas.
     *
     * @param event The event triggering this function
     *
     * @author Mathieu Fehr
     */
    onMouseUp(event: MouseEvent) {
        if(this.firstPoint === null) {
            return;
        }

        this.secondPoint = this.workspace.getMouseEventCoordinates(event);
        this.secondPoint.x = Math.floor(this.secondPoint.x);
        this.secondPoint.y = Math.floor(this.secondPoint.y);

        if(this.firstPoint.x === this.secondPoint.x && this.firstPoint.y === this.secondPoint.y) {
            this.workspace.clearSelection();
        } else {
            this.applySelection(this.firstPoint, this.secondPoint);
            this.saveInHistory(this.previousSelection, this.workspace.selectedArea);
        }

        this.firstPoint = null;
        this.secondPoint = null;
    }


    /**
     * The action made when the user move the mouse in the drawing canvas.
     *
     * @param event The event triggering this function
     *
     * @author Mathieu Fehr
     */
    onMouseMove(event: MouseEvent) {
        if(this.firstPoint === null) {
            return;
        }
        this.secondPoint = this.workspace.getMouseEventCoordinates(event);
        this.secondPoint.x = Math.floor(this.secondPoint.x);
        this.secondPoint.y = Math.floor(this.secondPoint.y);
        this.previewSelection(this.firstPoint, this.secondPoint);
    }


    /**
     * Define the selection in the image.
     *
     * @param firstPoint    The first point selected by the user
     * @param secondPoint   The second point selected by the user
     *
     * @author Mathieu Fehr
     */
    applySelection(firstPoint: Point, secondPoint: Point) {
        // The current image
        let width = this.workspace.selectedArea.width;
        let height = this.workspace.selectedArea.height;

        // Get the rectangle corners
        let min_x = Math.min(firstPoint.x, secondPoint.x);
        let min_y = Math.min(firstPoint.y, secondPoint.y);
        let max_x = Math.max(firstPoint.x, secondPoint.x);
        let max_y = Math.max(firstPoint.y, secondPoint.y);

        // The rectangle will be contained in this box
        let drawing_min_x = Math.max(0,min_x);
        let drawing_min_y = Math.max(0,min_y);
        let drawing_max_x = Math.min(width-1,max_x);
        let drawing_max_y = Math.min(height-1,max_y);

        this.workspace.selectedArea.data.fill(0);
        for(let i = drawing_min_y; i<=drawing_max_y; i++) {
            this.workspace.selectedArea.data.fill(255, i*width + drawing_min_x, i*width + drawing_max_x+1)
        }

        this.workspace.displaySelection();
    }


    /**
     * Preview the selection in the selection canvas.
     *
     * @param {Point} firstPoint    The first point selected by the user
     * @param {Point} secondPoint   The second point selected by the user
     *
     * @author Mathieu Fehr
     */
    previewSelection(firstPoint: Point, secondPoint: Point) {
        // The current image
        let width = this.workspace.selectedArea.width;
        let height = this.workspace.selectedArea.height;

        // Get the rectangle corners
        let min_x = Math.min(firstPoint.x, secondPoint.x);
        let min_y = Math.min(firstPoint.y, secondPoint.y);
        let max_x = Math.max(firstPoint.x, secondPoint.x);
        let max_y = Math.max(firstPoint.y, secondPoint.y);

        // The selection rectangle will be contained in this box
        let drawing_min_x = Math.max(0,min_x);
        let drawing_min_y = Math.max(0,min_y);
        let drawing_max_x = Math.min(width-1,max_x);
        let drawing_max_y = Math.min(height-1,max_y);

        this.workspace.selectionCanvas.clear();
        let previewImage = this.workspace.selectionCanvas.getImageData();
        for(let j = Math.max(drawing_min_x - 1, 0); j <= Math.min(drawing_max_x + 1, width - 1); j++) {
            if (drawing_min_y - 1 >= 0) {
                let greyColor = Math.floor(((j + drawing_min_y - 1) % 10) / 5) * 255;
                previewImage.data[4 * (j + width * (drawing_min_y - 1))] = greyColor;
                previewImage.data[4 * (j + width * (drawing_min_y - 1)) + 1] = greyColor;
                previewImage.data[4 * (j + width * (drawing_min_y - 1)) + 2] = greyColor;
                previewImage.data[4 * (j + width * (drawing_min_y - 1)) + 3] = 255;
            }
            if (drawing_max_y + 1 < height) {
                let greyColor = Math.floor(((j + drawing_max_y + 1) % 10) / 5) * 255;
                previewImage.data[4 * (j + width * (drawing_max_y + 1))] = greyColor;
                previewImage.data[4 * (j + width * (drawing_max_y + 1)) + 1] = greyColor;
                previewImage.data[4 * (j + width * (drawing_max_y + 1)) + 2] = greyColor;
                previewImage.data[4 * (j + width * (drawing_max_y + 1)) + 3] = 255;
            }
        }

        for(let i = Math.max(drawing_min_y - 1, 0); i <= Math.min(drawing_max_y + 1, height - 1); i++) {
            if (drawing_min_x - 1 >= 0) {
                let greyColor = Math.floor(((drawing_min_x - 1 + i) % 10) / 5) * 255;
                previewImage.data[4 * (drawing_min_x - 1 + width * i)] = greyColor;
                previewImage.data[4 * (drawing_min_x - 1 + width * i) + 1] = greyColor;
                previewImage.data[4 * (drawing_min_x - 1 + width * i) + 2] = greyColor;
                previewImage.data[4 * (drawing_min_x - 1 + width * i) + 3] = 255;
            }
            if (drawing_max_x + 1 < width) {
                let greyColor = Math.floor(((drawing_max_x + 1 + i) % 10) / 5) * 255;
                previewImage.data[4 * (drawing_max_x + 1 + width * i)] = greyColor;
                previewImage.data[4 * (drawing_max_x + 1 + width * i) + 1] = greyColor;
                previewImage.data[4 * (drawing_max_x + 1 + width * i) + 2] = greyColor;
                previewImage.data[4 * (drawing_max_x + 1 + width * i) + 3] = 255;
            }
        }

        this.workspace.selectionCanvas.setImageData(previewImage);
    }


    /**
     * This function saves the changement of SelectedArea.
     * @param  {SelectedArea} previousSelection the SelectedArea before the action.
     * @param  {SelectedArea} newSelection      the SelectedArea after the action.
     * @return {[type]}                         returns nothing, works by side-effect.
     *
     * @author Josselin GIET
     */
    saveInHistory (previousSelection: SelectedArea, newSelection: SelectedArea){
        EventManager.spawnEvent(
            "rubens_historySaveStep",
            new EditSelectionStep(this.name, previousSelection, newSelection)
        )
    }
}
