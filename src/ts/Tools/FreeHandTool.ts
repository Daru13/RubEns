import { Tool } from "./Tool";
import { Point } from "../utils/Point";
import { Canvas } from "../Image/Canvas";
import { Line } from "../DrawingPrimitives/Line";
import * as Params from "../Parameter";
import { ToolParameters } from "./Tool";
import { Ellipse } from "../DrawingPrimitives/Ellipse";
import { Color } from "../utils/Color";


/**
 * Set of parameters used by [[FreeHandTool]].
 * Default values of those parameters are defined in the class implementation.
 */
export class FreeHandParameters implements ToolParameters {
    color: Params.ColorParameter = {
        kind: Params.ParameterKind.Color,
        value: "#000000",
        name: "Color"
    };

    thickness: Params.NumberParameter = {
        kind: Params.ParameterKind.Number,
        value: 1,
        name: "Pencil thickness",
        min: 1,
        step: 1
    };
}


/**
 * Tool used for free-hand drawing.
 *
 * Draw lines between each consecutive points selected by the user with its
 * mouse with left-button pressed.
 */
export class FreeHandTool extends Tool {

    readonly name = "Pen";

    /**
     * Set of parameters of this tool.
     */
    parameters: FreeHandParameters;

    /**
     * The last known position of the mouse.
     */
    private lastPosition: Point;


    /**
     * Basic constructor.
     *
     * @author Mathieu Fehr
     */
    constructor () {
        super();
        this.parameters = new FreeHandParameters();
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
        this.drawLine(this.workspace.workingCanvas, currentPosition);
        this.lastPosition = currentPosition;
    }

    /**
     * The action made when the user release the mouse button.
     *
     * @author Mathieu Fehr
     */
    onMouseUp(event: MouseEvent) {
        // We first draw the last line
        this.onMouseMove(event);
        this.workspace.applyWorkingCanvas();
        this.lastPosition = null;
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
     * Returns a function to apply on canvas
     * @param  {LineParameters} param thickness and color
     *
     * @author Josselin GIET
     */
    static getLambda (param: FreeHandParameters) {
        return function(center: Point, image: ImageData) {
            let color = Color.buildFromHex(param.color.value);
            let thickness = param.thickness.value;
            Ellipse.drawFromCenter(image, center, thickness, thickness, color, 0, 0, color);
        };
    }


    /**
     * Draw a line from this.lastPosition to currentPosition on the given canvas.
     *
     * @param image             The image where the line will be drawn
     * @param currentPosition   The current position of the mouse
     *
     * @author Mathieu Fehr
     */
    drawLine(image: Canvas, currentPosition: Point) {
        let imageData = image.getImageData();
        Line.draw(imageData, this.lastPosition, currentPosition, FreeHandTool.getLambda(this.parameters));
        image.setImageData(imageData);
    }
}
