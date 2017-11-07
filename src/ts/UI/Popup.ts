import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { Document } from "../Document";


/**
 * Set of parameters used by [[Popup]].
 * Default values of those parameters are defined in the class implementation.
 *
 * This set of parameters should be extended for a more specific kind of popup, if required.
 */
 export class PopupParameters {
     /**
      * If set to `true`, display a close button on the popup.
      */
     displayCloseButton: boolean = true;

     /**
      * If set to `true`, darken the background behind the popup when shwoing it.
      */
     darkenBackground: boolean = true;

    //  /**
    //   * If set to `true`, immediately show the popup once it has been created.
    //   */
    //  showAfterCreation: boolean = true;
 }


/**
 * Enumeration of accepted display state values for a popup.
 * It can either be displayed or closed (hidden).
 */
 enum PopupState {
     DISPLAYED = "displayed",
     CLOSED    = "closed"
 };


/**
 * Generic UI element representing a popup.
 *
 * It can contain a message, a menu, etc.
 * Specific popups should extend this class to specialize it.
 */
export class Popup extends HTMLRenderer {
    protected rootNodeClasses = "popup";

    /**
     * Related document instance.
     */
    document: Document;

    /**
     * Root node of the actual content of the popup.
     */
    protected contentNode: JQuery;

    /**
     * Reference to the content wrapper node of the popup.
     */
    protected contentWrapperNode: JQuery;

    /**
     * Reference to the container node of the popup.
     */
    protected containerNode: JQuery;

    /**
     * Title of the popup.
     */
    readonly title: string;

    /**
     * Reference to the title of the popup.
     * It should be `undefined` if there is none.
     */
    protected titleNode: JQuery;

    /**
     * Reference to the close button of the popup.
     * It should be `undefined` if there is none.
     */
    protected closeButtonNode: JQuery;

    /**
     * Parameters of the popup.
     */
    protected parameters: PopupParameters;

    /**
     * Display state of the popup: displayed or closed.
     */
    protected displayState: PopupState;

    /**
     * Callback function called when the popup is about to be showed.
     * It receives the opening popup as its only argument.
     */
    onShow: (popup: Popup) => void;

    /**
     * Callback function called when the popup is about to be closed.
     * It receives the closing popup as argument.
     */
    onClose: (popup: Popup) => void;


    /**
     * Event handler for a click on the close button.
     */
    protected closeButtonClickHandler = {
        eventTypes: ["click"],
        selector  : ".popup_close_button",
        callback  : (_) => { this.close(); }
    }


    /**
     * Instanciates and initializes an empty, new Popup object.
     * @param  {JQuery}          parentNode  Parent node owning current instance.
     * @param  {Document}        document    Related document instance.
     * @param  {PopupParameters} parameters  Set of parameters of the popup.
     * @param  {string}          title       Optionnal title of the popup.
     * @param  {JQuery}          contentNode Optionnal content of the popup.
     * @return {Popup}                       Fresh instance of Popup.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery,
                 document: Document,
                 parameters: PopupParameters,
                 title?: string,
                 contentNode?: JQuery) {
        super(parentNode);
        this.createRootNode(false);

        this.document    = document;
        this.parameters  = parameters;
        this.title       = title;
        this.contentNode = contentNode;

        this.initialize();
    }


    /**
     * Generically set up the popup accordingly to its parameters.
     * It respects the semantic of [[PopupParameters]].
     *
     * @author Camille Gobert
     */
    protected initialize () {
        this.createContainerNode();

        if (this.title !== undefined) {
            this.createTitleNode();
        }

        this.createContentWrapperNode();

        if (this.parameters.displayCloseButton) {
            this.createCloseButton();
        }

        if (! this.parameters.darkenBackground) {
            this.rootNode.addClass("no_background");
        }

        // if (this.parameters.showAfterCreation) {
        //     this.show();
        // }
    }


    /**
     * Create and initialize the container node.
     * It contains all the actual data and controls of the popup.
     *
     * @author Camille Gobert
     */
    protected createContainerNode () {
        let containerNode = $("<div>");
        containerNode.addClass("popup_container");

        this.containerNode = containerNode;

        this.rootNode.append(containerNode);
    }


    /**
     * Create and initialize the content wrapper node.
     * It contains the given `content` data.
     *
     * @author Camille Gobert
     */
    protected createContentWrapperNode () {
        let contentWrapperNode = $("<div>");
        contentWrapperNode.addClass("popup_content_wrapper");

        this.contentWrapperNode = contentWrapperNode;

        this.containerNode.append(contentWrapperNode);
    }


    /**
     * Create and initialize the close button node.
     * It contains a control allowing the user to close the popup manually.
     *
     * @author Camille Gobert
     */
    protected createCloseButton () {
        let closeButtonNode = $("<button>");
        closeButtonNode.attr("type", "button");
        closeButtonNode.addClass("popup_close_button");
        closeButtonNode.html("&#x274C");

        this.closeButtonNode = closeButtonNode;

        this.containerNode.append(closeButtonNode);
    }


    /**
     * Create and initialize the title node.
     * It contains the title of the popup, if any.
     *
     * @author Camille Gobert
     */
    protected createTitleNode () {
        let titleNode = $("<h2>");
        titleNode.addClass("popup_title");
        titleNode.html(this.title);

        this.titleNode = titleNode;

        this.containerNode.append(titleNode);
    }


    /**
     * Set a new content node, and update the popup accordingly.
     * @param  {JQuery} newContent The new content root node.
     *
     * @author Camille Gobert
     */
    setContentNode (newContentNode: JQuery) {
        this.contentNode = newContentNode;

        this.contentWrapperNode.empty();
        this.contentWrapperNode.append(newContentNode);
    }


    /**
     * Show the popup by adding it to the DOM, and start handling events.
     * If defined, the `onShow` callback is also called.
     *
     * This method has no effect if the display state is already equal to `DISPLAYED`.
     *
     * @author Camille Gobert
     */
    show () {
        if (this.displayState == PopupState.DISPLAYED) {
            return;
        }

        if (this.onShow) {
            this.onShow(this);
        }

        this.startHandlingEvents();
        $("body").prepend(this.rootNode);

        this.displayState = PopupState.DISPLAYED;
    }


    /**
     * Close the popup by removing it from the DOM, and stop handling events.
     * If defined, the `onClose` callback is also called.
     *
     * This method has no effect if the display state is already equal to `CLOSED`.
     *
     * @author Camille Gobert
     */
    close () {
        if (this.displayState == PopupState.CLOSED) {
            return;
        }

        if (this.onClose) {
            this.onClose(this);
        }

        this.rootNode.remove();
        this.stopHandlingEvents();

        this.displayState = PopupState.CLOSED;
    }


    /**
     * Start handling popup events (e.g. clicks on the close button).
     * This method should be overriden to handle events required by more specific kinds of popups.
     *
     * @author Camille Gobert
     */
    protected startHandlingEvents () {
        if (this.parameters.displayCloseButton) {
            this.document.eventManager.registerEventHandler(this.closeButtonClickHandler);
        }
    }


    /**
     * Stop handling popup events (e.g. clicks on the close button).
     * This method should be overriden to handle events required by more specific kinds of popups.
     *
     * @author Camille Gobert
     */
    protected stopHandlingEvents () {
        if (this.parameters.displayCloseButton) {
            this.document.eventManager.unregisterEventHandler(this.closeButtonClickHandler);
        }
    }
}
