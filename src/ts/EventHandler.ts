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
     * Optionnal elector to filter which events should be handled.
     *
     * If defined, this selector will be applied to the `window` element,
     * in a standard jQuery filtering fashion.
     */
    selector?: JQuery | string;

    /**
     * Callback function called when an event is accepted by the selector.
     */
    callback: (event: Event) => void;

    /**
     * Optionnal flag; if defined and set to true, ignore this handler.
     */
    disabled?: boolean;
}
