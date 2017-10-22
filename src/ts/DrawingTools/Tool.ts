import { Canvas } from "../Image/Canvas";
import { EventManager } from "../UI/EventManager";
import { EventHandler } from "../UI/EventHandler";
import { ImageWorkspace } from "../ImageWorkspace";
import * as Params from "../Parameter";

/**
 * Abstract type for a set of tool parameters.
 * This interface should be implemented by any set of parameters used by a tool.
 */
export interface ToolParameters {};


/**
 * A tool available to the user for drawing/modifying the image.
 */
export abstract class Tool {

    /**
     * The name of the tool.
     * This information may for instance be used by the UI.
     */
    readonly name: string;

    /**
     * The list of event handlers.
     */
    protected eventHandlers: EventHandler[];

    /**
     * The image workspac where to apply the tool operations.
     */
    workspace: ImageWorkspace;

    /**
     * The set of parameters of the tool.
     * It may be empty.
     */
    parameters: ToolParameters;

    /**
     * Basic constructor.
     *
     * @author Mathieu Fehr
     */
    constructor () {
        this.eventHandlers = [];

        // Starts with a null value, defined later in time (before any use)
        this.workspace = null;
    }


    /**
     * Register all necessary events handlers required by the tool.
     * @param eventManager The manager dispatching the events.
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
     * @param eventManager The manager dispatching the events.
     *
     * @author Mathieu Fehr
     */
    unregisterEvents(eventManager: EventManager) {
        for (let handler of this.eventHandlers) {
            eventManager.unregisterEventHandler(handler);
        }
    }
}
