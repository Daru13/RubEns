import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { RubEns } from "../RubEns";

/**
 * Main UI element representing the bottom status bar of the GUI.
 *
 * It is meant to contain various information about the current document/workspace.
 * It should be updated in order to always display fresh and relevant information to the user.
 */
export class StatusBar extends HTMLRenderer {
    protected rootNodeId = "status_bar";

    /**
     * Related app instance.
     */
    private app: RubEns;

    /**
     * Last saved position of the mouse, taking the drawing canvas top-left hand corner for origin.
     */
    private lastKnownMousePosition = {x: 0, y: 0};

    /**
     * Last saved current tool name.
     */
    private lastKnownCurrentToolName = "";

    /**
     * Reference to the mouse position node.
     */
    private mousePositionNode: JQuery;

    /**
     * Reference to the current tool node.
     */
    private currentToolNode: JQuery;

    /**
     * Reference to the document properties node.
     */
    private documentPropertiesNode: JQuery;

    /**
     * Event handler for mousemouve.
     */
    private mouseMoveHandler = {
        eventTypes: ["mousemove"],
        callback: (event) => {
            // Update last known mouse position
            if (this.app.document) {
                let mouseEvent = <MouseEvent> event;
                this.lastKnownMousePosition = this.app.document.imageWorkspace.drawingCanvas.getMouseEventCoordinates(mouseEvent);
            }

            this.updateMousePositionNode();
        }
    };

    /**
     * Event handler for tool change.
     */
    private toolChangedHandler = {
        eventTypes: ["rubens_toolChanged"],
        callback: (_) => {
            // Update last known current tool name
            this.lastKnownCurrentToolName = this.app.document.getCurrentTool().name;

            this.updateCurrentToolNode();
        }
    };

    /**
     * Event handler for document changes.
     */
    private documentChangedHandler = {
        eventTypes: ["rubens_documentCreated", "rubens_documentClosed"],
        callback: (_) => { this.updateDocumentPropertiesNode(); }
    };

    /**
     * Instanciates and initializes a new, empty StatusBar object.
     * @param  {JQuery}    parentNode Parent node owning current instance.
     * @param  {RubEns}    app        Related app instance.
     * @return {StatusBar}            Fresh instance of StatusBar.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, app: RubEns) {
        super(parentNode);

        this.app = app;

        this.createRootNode();
        this.updateRootNode();

        this.registerEventHandlers();
    }

    /**
     * Calls `super.createRootNode`, and create all sub-nodes of the status bar.
     *
     * @author Camille Gobert
     */
    createRootNode () {
        super.createRootNode();

        this.createDocumentPropertiesNode();
        this.createMousePositionNode();
        this.createCurrentToolNode();
    }


    /**
     * Create and save a node meant to contain some document properties, and append it to the root node.
     *
     * @author Camille Gobert
     */
    private createDocumentPropertiesNode () {
        let documentPropertiesNode = $("<span>");
        documentPropertiesNode.attr("class", "document_properties")

        this.rootNode.append(documentPropertiesNode);

        this.documentPropertiesNode = documentPropertiesNode;
    }


    /**
     * Create and save a node meant to contain the mouse position, and append it to the root node.
     *
     * @author Camille Gobert
     */
    private createMousePositionNode () {
        let mousePositionNode = $("<span>");
        mousePositionNode.attr("class", "mouse_position")

        this.rootNode.append(mousePositionNode);

        this.mousePositionNode = mousePositionNode;
    }

    /**
     * Create and save a node meant to contain the current tool, and append it to the root node.
     *
     * @author Camille Gobert
     */
    private createCurrentToolNode () {
        let currentToolNode = $("<span>");
        currentToolNode.attr("class", "current_tool")

        this.rootNode.append(currentToolNode);

        this.currentToolNode = currentToolNode;
    }


    /**
     * Calls `super.updateRootNode`, and update all sub-nodes of the status bar.
     *
     * @author Camille Gobert
     */
    updateRootNode () {
        super.updateRootNode();

        this.updateDocumentPropertiesNode();
        this.updateMousePositionNode();
        this.updateCurrentToolNode();
    }


    /**
     * Update the content of the document properties node.
     * If there is no document, it contains a default string.
     *
     * @author Camille Gobert
     */
    updateDocumentPropertiesNode () {
        this.documentPropertiesNode.empty();

        if (! this.app.document) {
            this.documentPropertiesNode.html("No open document.");
            return;
        }

        let documentName   = this.app.document.parameters.title.value;
        let documentWidth  = this.app.document.parameters.width.value;
        let documentHeight = this.app.document.parameters.height.value;

        let documentPropertiesAsString = "<strong>" + documentName + "</strong>"
                                       + " (" + documentWidth + "&times;" + documentHeight + ")";
        this.documentPropertiesNode.html(documentPropertiesAsString);
    }


    /**
     * Update the content of the mouse position node.
     * If there is no document, it contains nothing.
     *
     * @author Camille Gobert
     */
    updateMousePositionNode () {
        this.mousePositionNode.empty();

        if (! this.app.document) {
            return;
        }

        let mousePositionAsString = "("  + Math.round(this.lastKnownMousePosition.x)
                                  + ", " + Math.round(this.lastKnownMousePosition.y) + ")";
        this.mousePositionNode.html(mousePositionAsString);
    }


    /**
     * Update the content of the current tool node.
     * If there is no document, it contains nothing.
     *
     * @author Camille Gobert
     */
    updateCurrentToolNode () {
        this.currentToolNode.empty();

        if (! this.app.document) {
            return;
        }

        this.currentToolNode.html(this.lastKnownCurrentToolName);
    }


    /**
     * Register all event handlers to the event manager.
     *
     * @author Camille Gobert
     */
    registerEventHandlers () {
        this.app.eventManager.registerEventHandler(this.mouseMoveHandler);
        this.app.eventManager.registerEventHandler(this.toolChangedHandler);
        this.app.eventManager.registerEventHandler(this.documentChangedHandler);
    }


    /**
     * Unregister all event handlers from the event manager.
     *
     * @author Camille Gobert
     */
    unregisterEventHandlers () {
        this.app.eventManager.unregisterEventHandler(this.mouseMoveHandler);
        this.app.eventManager.unregisterEventHandler(this.toolChangedHandler);
        this.app.eventManager.unregisterEventHandler(this.documentChangedHandler);
    }
}
