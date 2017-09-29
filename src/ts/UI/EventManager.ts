import { EventHandler, EventHandlerCallback } from "./EventHandler";

/**
 * This class is an important part of the Controller,  meant to handle all events
 * from the user interface and to redistribute them to the Model classes.
 */
export class EventManager {
    // Static list of handled events
    // All events which should be handled by this manager must be listed here!
    static handledEvents: Array<string> = [
        "click"
    ];
    
    // List of registered handlers
    private registeredHandlers: Array<EventHandler>;


    constructor () {

    }

    /**
     * Add an event handler to the manager.
     * @param handler   Event handler to register.
     *
     * @author Camille Gobert
     */
    registerEventHandler (handler: EventHandler) {
        this.registeredHandlers.push(handler);
    }

    /**
     * Remove an event handler from the event manager.
     * @param handler   Event handler to unregister.
     * @return The event handler which has been removed, or undefined if
     *         if could not be found among the registered handlers.
     *
     * @author Camille Gobert
     */
    unregisterEventHandler (handler: EventHandler) {
        let handlerIndex = this.registeredHandlers.indexOf(handler);
        if (handlerIndex === -1) {
            return undefined;
        }

        return this.registeredHandlers.splice(handlerIndex, 1);
    }

    /**
     * Internally dispatch an event to matching, registered event handlers.
     * @param event   Event to dispatch.
     *
     * @author Camille Gobert
     */
    private dispatchEvent (event: object) {
        // Browse all registered event handlers and check their selectors
        for (let handler of this.registeredHandlers) {
            // Ignore disabled events
            if (handler.disabled) {
                continue;
            }

            let matchingElement = $(event.target).closest(handler.selector);

            // If current handler selector does not match, continue with the next one
            if (matchingElement.length === 0) {
                continue;
            }

            // Otherwise, notify the handler it has received an event
            handler.callback(event);
        }
    }


}
