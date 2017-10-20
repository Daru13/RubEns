import {Tool} from "./Tool";
import {Point} from "../utils/Point";
import {Canvas} from "../Image/Canvas";
import {Line} from "../DrawingPrimitives/Line";
import {ImageWorkspace} from "../ImageWorkspace";
import { Ellipse } from "../DrawingPrimitives/Ellipse"
import { Rectangle } from "../DrawingPrimitives/Rectangle"
import { LineParameters } from "./LineParameters"


/**
 * Tool used for free-hand drawing.
 *
 * The user click to start the drawing, and release the mouse button to stop
 */
export class FreeHandTool extends Tool {

    /**
     * Parameters of the current brush
     *
     * @author Josselin GIET
     *
     */
    parameters: LineParameters = new LineParameters();

    /**
     * The last known position of the mouse
     */
    private lastPosition: Point;


    /**
     * Basic constructor
     *
     * @param workspace The image workspace, where the operations are displayed
     *
     * @author Mathieu Fehr
     */
    constructor(workspace: ImageWorkspace) {
        super(workspace);
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

        this.lastPosition = this.workspace.workingCanvas.getMouseEventCoordinates(event);
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
        let currentPosition = this.workspace.workingCanvas.getMouseEventCoordinates(event);
        currentPosition.x = Math.floor(currentPosition.x);
        currentPosition.y = Math.floor(currentPosition.y);
        this.drawLine(this.workspace.drawingCanvas, currentPosition);
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
     * Returns a function to apply on canvas
     * @param  {LineParameters} param thickness and color
     * @return {ToDraw}               a function to apply on canvas
     *
     * @author Josselin GIET
     */
    static getLambda(param: LineParameters){
        let brush = function(center: Point, image: ImageData){
            Ellipse.drawFromCenter(image, center, param.thickness.value, param.thickness.value)
        }
        return brush
    }


    /**
     * Draw a line from this.lastPosition to currentPosition on the given canvas
     *
     * @param image             The image where the line will be drawn
     * @param currentPosition   The current position of the mouse
     */
    drawLine(image: Canvas, currentPosition: Point) {
        let imageData = image.getImageData();
        Line.draw(imageData, this.lastPosition, currentPosition, FreeHandTool.getLambda(this.parameters));
        image.setImageData(imageData);
    }
}
