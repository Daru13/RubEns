import { Canvas } from "../Image/Canvas";
import { DrawingParameters } from "./DrawingParameters";
import { DrawingTool } from "./DrawingTool"
import { EventManager } from "../UI/EventManager";
import { Point } from "../utils/Point"




export class DrawLine extends DrawingTool {

    /**
     * the begining point of the segment
     */
    private toPoint : Point

    /**
     * the ending point of the segment
     */
    private fromPoint : Point

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

    onMouseDown(event: MouseEvent){
        this.fromPoint = this.workingCanvas.getMouseEventCoordinates(event);
        this.fromPoint.x = Math.floor(this.fromPoint.x);
        this.fromPoint.y = Math.floor(this.fromPoint.y);
    }

    onMouseUp(event: MouseEvent){
        this.toPoint = this.workingCanvas.getMouseEventCoordinates(event);
        this.toPoint.x = Math.floor(this.toPoint.x);
        this.toPoint.y = Math.floor(this.toPoint.y);
        this.apply(this.drawingCanvas,null);
        this.fromPoint = null;
        this.toPoint = null;
    }

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

    apply (image: Canvas, parameters: DrawingTool){
        DrawLine.draw(image,this.fromPoint,this.toPoint,1);
    }

    /**
     * draw a line
     * @param image         the image where the line is drawn
     * @param from          the starting point
     * @param to            the ending point
     * @param thickness     the thickness of the line
     */
    static draw (image: Canvas, from: Point, to: Point, thickness: number ){
        // This function paint a pixel in black (by side-effect)
        let imageData = image.getImageData();

        let paintItBlack = function (pixel: Point) {
            let coordonee1D : number = (pixel.y*imageData.width)*4 + pixel.x
            imageData.data[coordonee1D] = 128;
            imageData.data[coordonee1D + 1] = 128;
            imageData.data[coordonee1D + 2] = 128;
            imageData.data[coordonee1D + 3] = 255;
        }

        let currentPixel: Point = from;
        paintItBlack(currentPixel);
        let dx: number = to.x - from.x;
        let dy: number = to.y - from.y;
        let xinc: number = 0;
        let yinc: number = 0;
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
                paintItBlack(currentPixel)
            }
        }
    }
}
