import { EventHandler} from "./EventHandler";
import * as $ from "jquery";

/**
 * Generic event manager, dispatching events to registrer event handlers.
 *
 * It is meant to be a central part of the Controller part of the MVC model,
 * allowing in particular the View and the Model to communicate over events.
 *
 * Each event type with at least one handler is mapped to its set of handlers.
 * Rgistrered event handlers thus cannot be duplicated.
 */
export class EventManager {
    /**
     * Map from known and used event types to sets of registrered handlers.
     */
    private registeredHandlers: Map<string, Set<EventHandler>>;

    /**
     * Listening state of the event manager.
     */
    private isListening: boolean;

    /**
     * Instanciates and initializes a new EventManager object.
     *
     * Note: it does not start listening for events until the [[startListening]] method is called.
     * @return {EventManager} Fresh instance of EventManager.
     *
     * @author Camille Gobert
     */
    constructor () {
        this.registeredHandlers = new Map();
        this.isListening = false;
    }

    /**
     * Add an event handler to the manager.
     * This method has no effect if the exact same handler has already been registered.
     *
     * The handler is added for every specified event type.
     * @param {EventHandler} handler Event handler to register.
     *
     * @author Camille Gobert
     */
    registerEventHandler (handler: EventHandler) {
        for (let eventType of handler.eventTypes) {
            // If an event type is encountered for the first time by the manager,
            // it must create a fresh set for this type
            if (! this.registeredHandlers.has(eventType)) {
                this.registeredHandlers.set(eventType, new Set());

                // Also add the appropriate event handler
                this.startListeningFor(eventType);
            }

            this.registeredHandlers.get(eventType).add(handler);
        }
    }

    /**
     * Remove an event handler from the event manager.
     *
     * The handler is removed for every specified event type.
     * @param  {EventHandler} handler  Event handler to unregister.
     *
     * @author Camille Gobert
     */
    unregisterEventHandler (handler: EventHandler) {
        for (let eventType of handler.eventTypes) {
            let eventTypeSet = this.registeredHandlers.get(eventType);
            if (! eventTypeSet) {
                continue;
            }

            eventTypeSet.delete(handler);

            // Possibly remove the set if it becomes empty
            if (eventTypeSet.size === 0) {
                this.registeredHandlers.delete(eventType);

                // Also remove the appropriate event handler
                this.stopListeningFor(eventType);
            }
        }
    }

    /**
     * Internally dispatch an event to matching, registered event handlers.
     * @param {Event}  event     Event to dispatch.
     *
     * @author Camille Gobert
     */
    private dispatchEvent (event: Event) {
        if (! this.isListening) {
            return;
        }

        // Browse all registered event handlers for the event type
        let handlers = this.registeredHandlers.get(event.type);

        for (let handler of handlers.values()) {
            if (handler.disabled) {
                continue;
            }

            // Check if the handler selector applies to the event target node
            if (handler.selector) {
                let matchingElement = $(event.target).closest(handler.selector);
                if (matchingElement.length === 0) {
                    continue;
                }
            }

            // Notify the handler
            handler.callback(event);
        }
    }


    /**
     * Start listening for a particular type of event.
     * @param  {string} eventType The event type to start listenning for.
     *
     * @author Camille Gobert
     */
    private startListeningFor (eventType: string) {
        window.addEventListener(eventType, (event) => this.dispatchEvent(event));
    }


    /**
     * Stop listening for a particular type of event.
     * @param  {string} eventType The event type to stop listenning for.
     *
     * @author Camille Gobert
     */
    private stopListeningFor (eventType: string) {
        $(document)[0].removeEventListener(eventType, (event) => this.dispatchEvent(event));
    }


    /**
     * Start listening for events.
     * Nothing happens if the manager was already listening.
     *
     * @author Camille Gobert
     */
    startListening () {
        if (this.isListening) {
            return;
        }

        this.isListening = true;
    }


    /**
     * Stop listening for events.
     * Nothing happens if the manager was not listening.
     *
     * @author Camille Gobert
     */
    stopListening () {
        if (! this.isListening) {
            return;
        }

        this.isListening = false;
    }

    static spawnEvent (type: string, data: object = {}, source: JQuery = $(document)) {
        let event = new CustomEvent(type, {
            bubbles: true,
            detail : data
        });

        source[0].dispatchEvent(event);
    }
}
