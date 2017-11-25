/**
 * Interface of an event handler callback function.
 *
 * @author Camille Gobert
 */
export interface EventHandlerCallback {
    /**
     * Callback function called upon the reception of some event.
     * It receives the related event as a parameter.
     */
    (event: Event): void;
}


/**
 * Interface which must be implemented by any class meant to handle events
 * received from the UI, by registering themselves to the event manager.
 *
 * @author Camille Gobert
 */
export interface EventHandler {
    /**
     * Array of types of events to handle.
     */
    eventTypes: string[];

    /**
     * Selector in the jQuery format, to filter which events should be handled.
     * This selector will be applied to the root of the document.
     */
    selector: JQuery | string;

    /**
     * Callback function called when an event is accepted by the selector.
     */
    callback: EventHandlerCallback;

    /**
     * Optionnal flag; if defined and set to true, ignore this handler.
     */
    disabled?: boolean;
}
