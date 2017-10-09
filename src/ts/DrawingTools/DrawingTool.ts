import { Canvas } from "../Image/Canvas";
import { Parameter } from "./ToolParameter";
import { EventManager } from "../UI/EventManager";
import { EventHandler } from "../UI/EventHandler";


/**
 * A tool available to the user for drawing/modifying the image.
 */
export abstract class DrawingTool {

    /**
     * The list of event handlers.
     */
    protected eventHandlers: EventHandler[];

    /**
     * The canvas where the image resides.
     */
    drawingCanvas: Canvas;

    /**
     * The canvas used to preview the operation
     */
    workingCanvas: Canvas;

    /**
     * Basic constructor
     */
    constructor (drawingCanvas: Canvas, workingCanvas: Canvas) {
        this.eventHandlers = [];
        this.drawingCanvas = drawingCanvas;
        this.workingCanvas = workingCanvas;
    }


    /**
     * Apply the operation to the given canvas.
     *
     * @param {Canvas} image                    The canvas where the operations are applied.
     * @param {ToolParameter} parameters    The parameters chosen by the user
     */
    abstract apply(image: Canvas, parameters: object);


    /**
     * Register all necessary events handlers required by the tool.
     *
     * @param {EventManager} eventManager   The manager dispatching the events.
     *
     * @author Mathieu Fehr
     */
    registerEvents(eventManager: EventManager) {
        for (let handler of this.eventHandlers) {
            eventManager.registerEventHandler(handler);
        }
    }


    /**
     * See documentation of registerEvents, and change register with unregister.
     *
     * @param {EventManager} eventManager   The manager dispatching the events.
     *
     * @author Mathieu Fehr
     */
    unregisterEvents(eventManager: EventManager) {
        for (let handler of this.eventHandlers) {
            eventManager.unregisterEventHandler(handler);
        }
    }
}
