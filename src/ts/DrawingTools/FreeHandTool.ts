import {Tool} from "./Tool";
import {Point} from "../utils/Point";
import {Canvas} from "../Image/Canvas";
import {Line} from "../DrawingPrimitives/Line";

export class FreeHandTool extends Tool {

    /**
     * The last position of the mouse, when drawing
     */
    private lastPosition: Point;


    /**
     * Basic constructor
     *
     * @param workingCanvas The current working canvas
     * @param previewCanvas The current preview canvas
     *
     * @author Mathieu Fehr
     */
    constructor(workingCanvas: Canvas, previewCanvas: Canvas) {
        super(workingCanvas, previewCanvas);
        this.lastPosition = null;

        this.initEventHandlers();
    }

    /**
     * The action made when the user click.
     *
     * @author Mathieu Fehr
     */
    onMouseDown(event: MouseEvent) {

        // This might happen if the user release the mouse button outside of the web browser
        if(this.lastPosition !== null) {
            return;
        }

        this.lastPosition = this.workingCanvas.getMouseEventCoordinates(event);
        this.lastPosition.x = Math.floor(this.lastPosition.x);
        this.lastPosition.y = Math.floor(this.lastPosition.y);
    }

    /**
     * The action made when the user move the mouse.
     *
     * @author Mathieu Fehr
     */
    onMouseMove(event: MouseEvent) {
        if(this.lastPosition === null) {
            return;
        }
        let currentPosition = this.workingCanvas.getMouseEventCoordinates(event);
        currentPosition.x = Math.floor(currentPosition.x);
        currentPosition.y = Math.floor(currentPosition.y);
        this.drawLine(this.drawingCanvas, currentPosition);
        this.lastPosition = currentPosition;
    }

    /**
     * The action made when the user release the mouse button
     *
     * @Mathieu Fehr
     */
    onMouseUp(event: MouseEvent) {
        // We first draw the last line
        this.onMouseMove(event);
        this.lastPosition = null;
    }


    /**
     * Setup the event handlers
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
     * Draw a line from this.lastPosition to currentPosition on the given canvas
     *
     * @param image             The image where the line will be drawn
     * @param currentPosition   The current position of the mouse
     */
    drawLine(image: Canvas, currentPosition: Point) {
        let imageData = image.getImageData();
        Line.draw(imageData, this.lastPosition, currentPosition, 1);
        image.setImageData(imageData);
    }
}