import { Canvas } from "../Image/Canvas";
import { Tool } from "./Tool";
import { Point } from "../utils/Point";
import { Line } from "../DrawingPrimitives/Line";


export class LineTool extends Tool {

    /**
     * The begining point of the segment
     */
    private toPoint : Point;

    /**
     * The ending point of the segment
     */
    private fromPoint : Point;


    /**
     * The action made when the user user click in the drawing canvas
     *
     * @param event The event triggering this function
     *
     * @author Josselin GIET
     */
    onMouseDown(event: MouseEvent){
        if (this.fromPoint !== null){
            return;
        }
        this.fromPoint = this.workingCanvas.getMouseEventCoordinates(event);
        this.fromPoint.x = Math.floor(this.fromPoint.x);
        this.fromPoint.y = Math.floor(this.fromPoint.y);
    }

    /**
     * The action made when the user release the mouse button in the drawing canvas
     *
     * @param event The event triggering this function
     *
     * @author Josselin GIET
     */
    onMouseUp(event: MouseEvent){
        if (this.fromPoint === null){
            return;
        }
        this.toPoint = this.workingCanvas.getMouseEventCoordinates(event);
        this.toPoint.x = Math.floor(this.toPoint.x);
        this.toPoint.y = Math.floor(this.toPoint.y);
        this.drawLine(this.drawingCanvas);
        this.fromPoint = null;
        this.toPoint = null;
    }

    /**
     * The action made when the user move the mouse button in the drawing canvas
     *
     * @param event The event triggering this function
     *
     * @author Josselin GIET
     */
    onMouseMove(event: MouseEvent){
        if(this.fromPoint === null){
            return;
        }
        this.toPoint = this.workingCanvas.getMouseEventCoordinates(event);
        this.toPoint.x = Math.floor(this.toPoint.x);
        this.toPoint.y = Math.floor(this.toPoint.y);
        this.workingCanvas.clear();
        this.drawLine(this.workingCanvas);
    }

    constructor(workingCanvas: Canvas, previewCanvas: Canvas) {
        super(workingCanvas,previewCanvas);
        this.toPoint = null;
        this.fromPoint = null;

        // Add the event handlers to the event manager
        this.eventHandlers.push({
            eventTypes: ["mousedown"],
                selector: "canvas",
            callback: (event) => this.onMouseDown(<MouseEvent> event)

        });
        this.eventHandlers.push({
            eventTypes: ["mouseup"],
            selector: "canvas",
            callback: (event) => this.onMouseUp(<MouseEvent> event)

        });
        this.eventHandlers.push({
            eventTypes: ["mousemove"],
            selector: "canvas",
            callback: (event) => this.onMouseMove(<MouseEvent> event)

        });

    }

    /**
     * This function draw a line between the pixel from and to.
     * It implements the algorithm of Bresenham
     * (cf. [[https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm]])
     *
     * @param image         the image where the line is drawn
     * @author Josselin GIET
     */
    drawLine (image: Canvas){
        let imageData = image.getImageData();

        Line.draw(imageData, this.fromPoint, this.toPoint, 1);

        image.setImageData(imageData);
    }
}
