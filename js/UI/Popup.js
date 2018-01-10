define(["require", "exports", "jquery", "./HTMLRenderer"], function (require, exports, $, HTMLRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Set of parameters used by [[Popup]].
     * Default values of those parameters are defined in the class implementation.
     *
     * This set of parameters should be extended for a more specific kind of popup, if required.
     */
    class PopupParameters {
        constructor() {
            /**
             * If set to `true`, display a close button on the popup.
             */
            this.displayCloseButton = true;
            /**
             * If set to `true`, darken the background behind the popup when shwoing it.
             */
            this.darkenBackground = true;
            //  /**
            //   * If set to `true`, immediately show the popup once it has been created.
            //   */
            //  showAfterCreation: boolean = true;
        }
    }
    exports.PopupParameters = PopupParameters;
    /**
     * Enumeration of accepted display state values for a popup.
     * It can either be displayed or closed (hidden).
     */
    var PopupState;
    (function (PopupState) {
        PopupState["DISPLAYED"] = "displayed";
        PopupState["CLOSED"] = "closed";
    })(PopupState || (PopupState = {}));
    /**
     * Generic UI element representing a popup.
     *
     * It can contain a message, a menu, etc.
     * Specific popups should extend this class to specialize it.
     */
    class Popup extends HTMLRenderer_1.HTMLRenderer {
        /**
         * Instanciates and initializes an empty, new Popup object.
         * @param  {JQuery}          parentNode  Parent node owning current instance.
         * @param  {RubEns}          app         Related app instance.
         * @param  {PopupParameters} parameters  Set of parameters of the popup.
         * @param  {string}          title       Optionnal title of the popup.
         * @param  {JQuery}          contentNode Optionnal content of the popup.
         * @return {Popup}                       Fresh instance of Popup.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app, parameters, title, contentNode) {
            super(parentNode);
            this.rootNodeClasses = "popup";
            /**
             * Event handler for a click on the close button.
             */
            this.closeButtonClickHandler = {
                eventTypes: ["click"],
                selector: ".popup_close_button",
                callback: (_) => { this.close(); }
            };
            this.createRootNode(false);
            this.app = app;
            this.parameters = parameters;
            this.title = title;
            this.contentNode = contentNode;
            this.initialize();
        }
        /**
         * Generically set up the popup accordingly to its parameters.
         * It respects the semantic of [[PopupParameters]].
         *
         * @author Camille Gobert
         */
        initialize() {
            this.createContainerNode();
            if (this.title !== undefined) {
                this.createTitleNode();
            }
            this.createContentWrapperNode();
            if (this.parameters.displayCloseButton) {
                this.createCloseButton();
            }
            if (!this.parameters.darkenBackground) {
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
        createContainerNode() {
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
        createContentWrapperNode() {
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
        createCloseButton() {
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
        createTitleNode() {
            let titleNode = $("<h2>");
            titleNode.addClass("popup_title");
            titleNode.html(this.title);
            this.titleNode = titleNode;
            this.containerNode.append(titleNode);
        }
        /**
         * Set a new content node, and update the popup accordingly.
         * @param  {JQuery} newContentNode The new content root node.
         *
         * @author Camille Gobert
         */
        setContentNode(newContentNode) {
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
        show() {
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
        close() {
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
        startHandlingEvents() {
            if (this.parameters.displayCloseButton) {
                this.app.document.eventManager.registerEventHandler(this.closeButtonClickHandler);
            }
        }
        /**
         * Stop handling popup events (e.g. clicks on the close button).
         * This method should be overriden to handle events required by more specific kinds of popups.
         *
         * @author Camille Gobert
         */
        stopHandlingEvents() {
            if (this.parameters.displayCloseButton) {
                this.app.document.eventManager.unregisterEventHandler(this.closeButtonClickHandler);
            }
        }
    }
    exports.Popup = Popup;
});
