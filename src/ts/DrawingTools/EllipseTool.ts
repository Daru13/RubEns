import { DrawingTool } from "./DrawingTool";
import { Canvas } from "../Image/Canvas";
import { DrawingParameters } from "./DrawingParameters";
import { Point } from "../utils/Point";
import { EventHandler } from "../UI/EventHandler";


/**
 * Tool used to draw ellipses.
 *
 * The user select two points, the first one being declared when the mouse button is clicked,
 * and the second one being declared when the mouse button is released.
 * The two points defines a rectangle, and the ellipse drawn is the circumscribed ellipse.
 */
export class EllipseTool extends DrawingTool {

    /**
     * The list of event handlers.
     */
    protected eventHandlers: EventHandler[];

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
        this.apply(this.drawingCanvas, null);
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
        this.apply(this.workingCanvas, null);
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
     * @param parameters    The parameters used to draw the ellipse (the color, the thickness)
     */
    apply(image: Canvas, parameters: DrawingParameters) {
        EllipseTool.drawEllipse(image, this.firstPoint, this.secondPoint);
    }


    /**
     * Apply the operation to the image
     *
     * @param image     The image where the ellipse is drawn
     * @param point1    The first point defining the inscribed rectangle
     * @param point2    The second point defining the inscribed rectangle
     *
     * @author Mathieu Fehr
     * // TODO add thickness support
     */
    static drawEllipse(image: Canvas, point1: Point, point2: Point) {
        // Check if the rectangle is defined
        if(point1 === null || point2 === null) {
            return;
        }

        // The current image
        let imageData = image.getImageData();
        let imageDataWidth = imageData.width;
        let imageDataHeight = imageData.height;

        // Get the circumscribed rectangle corners
        let min_x = Math.min(point1.x, point2.x);
        let min_y = Math.min(point1.y, point2.y);
        let max_x = Math.max(point1.x, point2.x);
        let max_y = Math.max(point1.y, point2.y);

        // The ellipse is defined as (x/a)^2 + (y/b)^2 = 1
        let a = (max_x - min_x)/2;
        let b = (max_y - min_y)/2;

        // The color is currently random
        let color_r = Math.random() * 255;
        let color_g = Math.random() * 255;
        let color_b = Math.random() * 255;

        // The ellipse will be contained
        let drawing_min_x = Math.max(0,min_x);
        let drawing_min_y = Math.max(0,min_y);
        let drawing_max_x = Math.min(imageDataWidth-1,max_x);
        let drawing_max_y = Math.min(imageDataHeight-1,max_y);

        // Draw the ellipse by checking every cell in the inscribed rectangle
        for(let i = drawing_min_x; i <= drawing_max_x; i++) {
            for(let j = drawing_min_y; j <= drawing_max_y; j++) {
                let x = (i-min_x-a);
                let y = (j-min_y-b);
                if((x/a)**2 + (y/b)**2 < 1) {
                    imageData.data[4 * (i + j * imageDataWidth)] = color_r;
                    imageData.data[4 * (i + j * imageDataWidth) + 1] = color_g;
                    imageData.data[4 * (i + j * imageDataWidth) + 2] = color_b;
                    imageData.data[4 * (i + j * imageDataWidth) + 3] = 255;
                }
            }
        }

        image.setImageData(imageData);
    }

}
