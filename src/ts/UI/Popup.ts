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
      * Title of the popup, displayed in the container.
      * An empty string means no title.
      */
     title: string = "";

     /**
      * If set to `true`, display a close button on the popup.
      */
     displayCloseButton: boolean = true;

     /**
      * If set to `true`, darken the background behind the popup when shwoing it.
      */
     darkenBackground: boolean = true;

     /**
      * If set to `true`, immediately show the popup once it has been created.
      */
     showAfterCreation: boolean = true;
 }


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
     * Reference to the content node of the popup.
     * All the content intended to be displayed into the popup must be placed into this node.
     * It can stay null if there is none.
     */
    protected contentNode: JQuery = null;

    /**
     * Reference to the container node of the popup.
     */
    protected containerNode: JQuery;

    /**
     * Reference to the title of the popup.
     * It can stay null if there is none.
     */
    protected titleNode: JQuery = null;

    /**
     * Reference to the close button of the popup.
     * It can stay null if there is none.
     */
    protected closeButtonNode: JQuery = null;

    /**
     * Parameters of the popup.
     */
    protected parameters: PopupParameters;


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
     * @param  {JQuery}          parentNode Parent node owning current instance.
     * @param  {Document}        document   Related document instance.
     * @param  {PopupParameters} parameters Set of parameters of the popup.
     * @param  {JQuery}          content    Initial content of the popup.
     * @return {Popup}                      Fresh instance of Popup.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document, parameters: PopupParameters,
                content: JQuery = null) {
        super(parentNode);
        this.createRootNode();

        this.document   = document;
        this.parameters = parameters;

        if (content) {
            this.contentNode = content;
        }

        this.initialize();
    }


    /**
     * Set up the popup accordingly to its parameters.
     * It respects the semantics given in [[PopupParameters]].
     *
     * @author Camille Gobert
     */
    protected initialize () {
        // Always start by creating a container node for the popup
        this.createContainerNode();

        if (this.parameters.title.length > 0) {
            this.createTitleNode(this.parameters.title);
        }

        if (this.parameters.displayCloseButton) {
            this.createCloseButton();
        }

        if (! this.parameters.darkenBackground) {
            this.rootNode.addClass("no_background");
        }

        if (this.contentNode) {
            this.containerNode.append(this.contentNode);
        }

        if (this.parameters.showAfterCreation) {
            this.show();
        }
    }


    /**
     * Create and initialize the container node.
     * The root node mainly exist as a global container and logical popup node,
     * whereas the latter actually contain and display controls and data.
     *
     * Note, however, than the popup content should **not** be set this way;
     * instead, it must be placed into the dedicated `contentNode`.
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
     * Create and initialize the close button node.
     * It contains a control allowing the user to close the popup manually.
     *
     * This node does not have to be created if the popup has no close button
     * @param {boolean} attachToContainer If `true`, the close button is appended to the container node once created (default).
     *                                    Otherwise, the node is just created and initialized.
     *
     * @author Camille Gobert
     */
    protected createCloseButton (attachToContainer: boolean = true) {
        let closeButtonNode = $("<button>");
        closeButtonNode.attr("type", "button");
        closeButtonNode.addClass("popup_close_button");
        closeButtonNode.html("&#x274C");

        this.closeButtonNode = closeButtonNode;

        if (attachToContainer) {
            this.containerNode.append(closeButtonNode);
        }
    }


    /**
     * Create and initialize the title node.
     * It contains the title of the popup, if any.
     *
     * This node does not have to be created if the popup has no title.
     * @param {string}  title             The title to display.
     * @param {boolean} attachToContainer If `true`, the title is appended to the container node once created (default).
     *                                    Otherwise, the node is just created and initialized.
     *
     * @author Camille Gobert
     */
    protected createTitleNode (title: string, attachToContainer: boolean = true) {
        let titleNode = $("<h2>");
        titleNode.addClass("popup_title");
        titleNode.html(title);

        this.titleNode = titleNode;

        if (attachToContainer) {
            this.containerNode.append(titleNode);
        }
    }


    /**
     * Show the popup by adding it to the DOM, and start handling clicks on the close button.
     *
     * @author Camille Gobert
     */
    show () {
        this.startHandlingCloseButtonClick();
        $("body").prepend(this.rootNode);
    }


    /**
     * Close the popup by removing it from the DOM, and stop handling clicks on the close button.
     *
     * Note that no internal element is destroyed by this method: it simply *hide* the popup node.
     * Therefore, it is totally possible to show an already closed popup again.
     *
     * @author Camille Gobert
     */
    close () {
        this.rootNode.remove();
        this.stopHandlingCloseButtonClick();
    }


    /**
     * Set a new content node, and update the popup accordingly.
     * @param  {JQuery} newContent The new content.
     *
     * @author Camille Gobert
     */
    setContentNode (newContent: JQuery) {
        // Remove previous content from the container if required
        if (this.contentNode) {
            this.containerNode.remove();
        }

        this.contentNode = newContent;

        // Append new content to the container
        this.containerNode.append(newContent);
    }


    /**
     * Start handling popup closing by clicking on the close button.
     * This method has no effect if there is no close button.
     *
     * @author Camille Gobert
     */
    startHandlingCloseButtonClick () {
        if (! this.closeButtonNode) {
            return;
        }

        this.document.eventManager.registerEventHandler(this.closeButtonClickHandler);
    }


    /**
     * Stop handling popup closing by clicking on the close button.
     *
     * @author Camille Gobert
     */
    stopHandlingCloseButtonClick () {
        this.document.eventManager.unregisterEventHandler(this.closeButtonClickHandler);
    }
}
