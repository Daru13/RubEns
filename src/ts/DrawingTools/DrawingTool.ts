import { Canvas } from "../Image/Canvas";
import { DrawingParameters } from "./DrawingParameters";
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
    workingCanvas: Canvas;

    /**
     * The canvas used to preview the operation
     */
    previewCanvas: Canvas;

    /**
     * Basic constructor
     */
    constructor(workingCanvas: Canvas, previewCanvas: Canvas) {
        this.eventHandlers = [];
        this.workingCanvas = workingCanvas;
        this.previewCanvas = previewCanvas;
    }


    /**
     * Apply the operation to the given canvas.
     *
     * @param {Canvas} image                    The canvas where the operations are applied.
     * @param {DrawingParameters} parameters    The parameters chosen by the user
     */
    abstract apply(image: Canvas, parameters: DrawingParameters);


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