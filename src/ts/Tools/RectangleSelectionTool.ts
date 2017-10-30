import { Tool } from "./Tool";
import { Point } from "../utils/Point";


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
            selector: "canvas",
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
        this.firstPoint = this.workspace.workingCanvas.getMouseEventCoordinates(event);
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

        this.secondPoint = this.workspace.workingCanvas.getMouseEventCoordinates(event);
        this.secondPoint.x = Math.floor(this.secondPoint.x);
        this.secondPoint.y = Math.floor(this.secondPoint.y);
        this.applySelection(this.firstPoint, this.secondPoint);
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
        this.secondPoint = this.workspace.workingCanvas.getMouseEventCoordinates(event);
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
        //this.previewSelection(firstPoint, secondPoint);

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

        this.workspace.displaySelection(this.workspace.selectedArea);
    }


    /**
     * Preview the selection in the image.
     *
     * @param {Point} firstPoint    The first point selected by the user
     * @param {Point} secondPoint   The second point selected by the user
     *
     * @author Mathieu Fehr
     */
    previewSelection(firstPoint: Point, secondPoint: Point) {
        this.applySelection(firstPoint, secondPoint);
    }
}
