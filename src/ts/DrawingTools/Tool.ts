import { Canvas } from "../Image/Canvas";
import { EventManager } from "../UI/EventManager";
import { EventHandler } from "../UI/EventHandler";
import {ImageWorkspace} from "../ImageWorkspace";


/**
 * A tool available to the user for drawing/modifying the image.
 */
export abstract class Tool {

    /**
     * The list of event handlers.
     */
    protected eventHandlers: EventHandler[];

    /**
     * The image workspace, where the operations are displayed
     */
    workspace: ImageWorkspace;

    /**
     * Basic constructor
     */
    constructor (workspace: ImageWorkspace) {
        this.eventHandlers = [];
        this.workspace = workspace
    }


    /**
     * Register all necessary events handlers required by the tool.
     *
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
     *
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
