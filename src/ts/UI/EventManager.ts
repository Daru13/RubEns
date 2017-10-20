import { EventHandler, EventHandlerCallback } from "./EventHandler";
import * as $ from "jquery";

/**
 * Generic event manager, dispatching events to registrer event handlers.
 *
 * It is meant to be a central part of the Controller part of the MVC model,
 * allowing in particular the View and the Model to communicate over events.
 */
export class EventManager {
    /**
     * Static list of handled events
     * All events which should be handled by this manager must be listed here!
     */
    static handledEvents: Array<string> = [
        "click",
        "mousemove",
        "mousedown",
        "mouseup",
        "mouseout",
        "mousein",
        "keypress",
        "change"
    ];

    private registeredHandlers: Array<EventHandler>;
    private isListening: boolean;

    /**
     * Instanciates and initializes a new EventManager object.
     * Note that it does not start listening for events until the [[startListening]] method is called.
     * @return {EventManager} Fresh instance of EventManager.
     *
     * @author Camille Gobert
     */
    constructor () {
        this.registeredHandlers = [];
        console.log("Registered handlers list created:", this.registeredHandlers);

        this.isListening = false;
    }

    /**
     * Add an event handler to the manager.
     * @param {EventHandler} handler Event handler to register.
     *
     * @author Camille Gobert
     */
    registerEventHandler (handler: EventHandler) {
        this.registeredHandlers.push(handler);
    }

    /**
     * Remove an event handler from the event manager.
     * @param {EventHandler} handler  Event handler to unregister.
     * @return                        The event handler which has been removed,
     *                                or undefined if it could not be found.
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
     * @param {Event} event Event to dispatch.
     *
     * @author Camille Gobert
     */
    private dispatchEvent (event: Event) {
        // Browse all registered event handlers and check their selectors
        for (let handler of this.registeredHandlers) {
            if (handler.disabled) {
                continue;
            }

            // Check if the event type matches one of the handled types
            if (! handler.eventTypes.find((type) => type === event.type)) {
                continue;
            }

            // Check if the handler selector applies to the event target node
            let matchingElement = $(event.target).closest(handler.selector);
            if (matchingElement.length === 0) {
                continue;
            }

            // Otherwise, notify the handler it has received an event
            handler.callback(event);
        }
    }

    /**
     * Start listening to events of the types listed in the related static array.
     * Nothing happens if the manager was already listening.
     *
     * @author Camille Gobert
     */
    startListening () {
        if (this.isListening) {
            return;
        }

        let self = this;
        for (let eventType of EventManager.handledEvents) {
            document.addEventListener(eventType, (event) => self.dispatchEvent(event));
        }

        this.isListening = true;
    }

    /**
     * Stop listening to events of the types listed in the related static array.
     * Nothing happens if the manager was not listening.
     *
     * @author Camille Gobert
     */
    stopListening () {
        if (! this.isListening) {
            return;
        }

        for (let eventType of EventManager.handledEvents) {
            document.removeEventListener(eventType, (event) => self.dispatchEvent(event));
        }

        this.isListening = false;
    }

}
