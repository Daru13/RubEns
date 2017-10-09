import { Tool } from "./Tool";
import { Canvas } from "../Image/Canvas";
import { Point } from "../utils/Point";
import { Rectangle } from "../DrawingPrimitives/Rectangle";

/**
 * Tool used to draw rectangles.
 *
 * The user select two points, and the rectangle drawn is the rectangle having the two points as corners.
 */
export class RectangleTool extends Tool {

    /**
     * The first point defining the rectangle
     */
    private firstPoint: Point;


    /**
     * The second point defining the rectangle
     */
    private secondPoint: Point;


    /**
     * The action made when the user click in the drawing canvas
     *
     * @param event The event
     *
     * @author Mathieu Fehr
     */
    onMouseDown(event: MouseEvent) {
        this.firstPoint = this.workingCanvas.getMouseEventCoordinates(event);
        this.firstPoint.x = Math.floor(this.firstPoint.x);
        this.firstPoint.y = Math.floor(this.firstPoint.y);
    }


    /**
     * The action made when the user release the mouse button in the drawing canvas
     *
     * @param event The event triggering this function
     *
     * @author Mathieu Fehr
     */
    onMouseUp(event: MouseEvent) {
        if(this.firstPoint === null) {
            return;
        }

        this.secondPoint = this.workingCanvas.getMouseEventCoordinates(event);
        this.secondPoint.x = Math.floor(this.secondPoint.x);
        this.secondPoint.y = Math.floor(this.secondPoint.y);
        this.drawRectangle(this.drawingCanvas);
        this.workingCanvas.clear();
        this.firstPoint = null;
        this.secondPoint = null;
    }


    /**
     * The action made when the user move the mouse in the drawing canvas
     *
     * @param event The event triggering this function
     *
     * @author Mathieu Fehr
     */
    onMouseMove(event: MouseEvent) {
        if(this.firstPoint === null) {
            return;
        }
        this.secondPoint = this.workingCanvas.getMouseEventCoordinates(event);
        this.secondPoint.x = Math.floor(this.secondPoint.x);
        this.secondPoint.y = Math.floor(this.secondPoint.y);
        this.workingCanvas.clear();
        this.drawRectangle(this.workingCanvas);
    }

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
        this.firstPoint = null;
        this.secondPoint = null;

        this.initEventHandlers();
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
     * Apply the operation to the given canvas
     *
     * @param image         The image where the ellipse is drawn
     *
     * @author Mathieu Fehr
     */
    drawRectangle(image: Canvas) {
        let imageData = image.getImageData();

        Rectangle.draw(this.firstPoint, this.secondPoint, imageData);

        image.setImageData(imageData);
    }
}