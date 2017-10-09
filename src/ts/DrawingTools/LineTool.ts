import { Canvas } from "../Image/Canvas";
import { DrawingTool } from "./DrawingTool";
import { Point } from "../utils/Point";
import { Line } from "../DrawingPrimitives/Line";


export class LineTool extends DrawingTool {

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
        this.apply(this.drawingCanvas,null);
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
        this.apply(this.workingCanvas, null);
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


    apply (image: Canvas, parameters: DrawingTool){
        LineTool.draw(image,this.fromPoint,this.toPoint,1);
    }


    /**
     * This function draw a line between the pixel from and to.
     * It implements the algorithm of Bresenham
     * (cf. [[https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm]])
     *
     * @param image         the image where the line is drawn
     * @param from          the starting point
     * @param to            the ending point
     * @param thickness     the thickness of the line
     * @author Josselin GIET
     */
    static draw (image: Canvas, from: Point, to: Point, thickness: number ){
        let imageData = image.getImageData();

        Line.draw(imageData,from,to,thickness);

        image.setImageData(imageData);
    }
}
