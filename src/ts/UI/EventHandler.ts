/**
 * Interface of an event handler callback function.
 * @param  event    Event matching the selector of the handler.
 *
 * @author Camille Gobert
 */
export interface EventHandlerCallback {
    (event: Event): void;
}


/**
 * Interface which must be implemented by any class meant to handle events
 * received from the UI, by registering themselves to the event manager.
 * @author Camille Gobert
 */
export interface EventHandler {
    // Array of types of events to handle.
    eventTypes: Array<string>;

    // Selector in the jQuery format, to filter which events should be handled.
    // This selector will be applied to the root of the document.
    selector: string;

    // Callback function called when an event is accepted by the selector.
    // It receives the event as a parameter.
    callback: EventHandlerCallback;

    // Optional.
    // If defined and set to true, ignore this handler.
    disabled?: boolean;
}
