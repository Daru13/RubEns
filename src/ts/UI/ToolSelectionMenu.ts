import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { Tool } from "../DrawingTools/Tool";
import { Document } from "../Document";

/**
 * UI element representing the tool selection menu.
 *
 * It manages a list of tools, defined elsewhere, and handles the change of current tool,
 * as well as (un)installing the related event handlers.
 */
export class ToolSelectionMenu extends HTMLRenderer {
    protected rootNodeId   = "tool_selection_menu";
    protected rootNodeType = "ul";

    /**
     * List of known tools to display in the UI.
     */
    private tools: object;

    /**
     * Related document intance.
     */
    private document: Document;

    /**
     * Event handler callback meant to be called when a click occurs on a tool.
     */
    private toolClickEventHandler = {
        eventTypes: ["click"],
        selector: ".tool_button",
        callback: (event) => this.onToolClick(event)
    };

    /**
     * Instanciates and initializes a new ToolSelectionMenu object,
     * and set up the related click event handler.
     * @param  {JQuery}            parentNode Parent node owning current instance.
     * @param  {Document}          document   Related document intance.
     * @return {ToolSelectionMenu}            Fresh instance of ToolSelectionMenu.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document) {
        super(parentNode);

        this.tools    = [];
        this.document = document;

        this.createRootNode();
        this.updateRootNode();

        this.document.eventManager.registerEventHandler(this.toolClickEventHandler);
    }

    /**
     * Empty the root node, and create and append a tool node for each known tool.
     *
     * @author Camille Gobert
     */
    updateRootNode () {
        this.rootNode.empty();

        for (let tool in this.tools) {
            let toolNode = ToolSelectionMenu.createToolNode(this.tools[tool]);
            this.rootNode.append(toolNode);
        }
    }

    /**
     * Update the list of known tools, and update the root node afterwards.
     * @param  {object} tools [description]
     *
     * @author Camille Gobert
     */
    setTools (tools: object) {
        this.tools = tools;
        this.updateRootNode();
    }

    /**
     * Static method for creating a tool node, i.e. a node representing a tool in the UI,
     * able to respond to a click by updating the document current tool.
     * @param  {Tool}   tool Tool to represent with a tool node.
     * @return {JQuery}      Fresh tool node.
     *
     * @author Camille Gobert
     */
    private static createToolNode (tool: Tool) {
        let toolName = tool.constructor.name;
        console.log("Node of tool" + toolName + " is created");

        let toolButton = $("<button>");
        toolButton.html(toolName);
        toolButton.attr("type", "button");
        toolButton.attr("id", toolName);
        toolButton.addClass("tool_button");

        let toolNode = $("<li>");
        toolNode.append(toolButton);

        return toolNode;
    }

    /**
     * Method which must be called when a click occurs on a tool node.
     * @param  {Event}  event Related click event.
     * 
     * @author Camille Gobert
     */
    onToolClick (event: Event) {
        // Get the clicked tool name
        let toolName = $(event.target).attr("id");
        console.log("clicked id: " + toolName);

        this.document.setCurrentDrawingTool(this.tools[toolName]);
    }
}
