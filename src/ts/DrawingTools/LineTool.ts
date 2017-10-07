import { Canvas } from "../Image/Canvas";
import { DrawingParameters } from "./DrawingParameters";
import { DrawingTool } from "./DrawingTool";
import { EventManager } from "../UI/EventManager";
import { Point } from "../utils/Point";
import { EllipseTool } from "./EllipseTool";


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

        /*
         * This function plot a pixel in the current canvas (in draw).
         * This function has to be replaced by a generic one.
         * param pixel      the pixel to plot
         * author Josselin GIET
         */
        function paintItBlack(pixel: Point) {
            // The color is currently random
            let color_r = 0; //Math.random() * 255;
            let color_g = 0; //Math.random() * 255;
            let color_b = 0; //Math.random() * 255;

            let coordonee1D : number = (pixel.y*imageData.width+pixel.x)*4;
            imageData.data[coordonee1D] = color_r;
            imageData.data[coordonee1D + 1] = color_g;
            imageData.data[coordonee1D + 2] = color_b;
            imageData.data[coordonee1D + 3] = 255;
        }

        let currentPixel: Point = new Point(from.x, from.y);
        paintItBlack(currentPixel);
        let dx: number = to.x - from.x;
        let dy: number = to.y - from.y;
        let xinc: number = 0;
        let yinc: number = 0;

        // First we compute in which "direction" x and y increase
        // between from and to
        if (dx > 0){
            xinc = 1;
        }
        else{
            xinc = -1;
        }
        if (dy > 0){
            yinc = 1;
        }
        else{
            yinc = -1;
        }
        dx = Math.abs(dx);
        dy = Math.abs(dy);
        paintItBlack(from);
        if (Math.abs(dx) >= Math.abs(dy)) {
            let cumul: number = dx/2;
            for(let x = from.x; x != to.x; x += xinc ){
                currentPixel.x += xinc;
                cumul += dy;
                if ( cumul >= dx ){
                    cumul -= dx;
                    currentPixel.y += yinc;
                }
                paintItBlack(currentPixel);
            }
        }
        else{
            let cumul: number = dy/2;
            for(let y = from.y; y != to.y; y += yinc){
                currentPixel.y += yinc;
                cumul += dx;
                if (cumul >= dy){
                    cumul -= dy;
                    currentPixel.x += xinc;
                }
                paintItBlack(currentPixel);
            }
        }
        image.setImageData(imageData);
    }
}
