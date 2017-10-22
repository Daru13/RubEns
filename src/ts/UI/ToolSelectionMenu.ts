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
     * Set of tools, to display in the UI.
     */
    private tools: Tool[];

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

        for (let tool of this.tools) {
            let toolNode = ToolSelectionMenu.createToolNode(tool);
            this.rootNode.append(toolNode);
        }
    }

    /**
     * Update the list of known tools, and update the root node afterwards.
     * @param  {Tool[]} tools List of [[Tool]] instances.
     *
     * @author Camille Gobert
     */
    setTools (tools: Tool[]) {
        this.tools = tools;
        this.updateRootNode();
    }

    /**
     * Static method for creating a tool node, i.e. a node representing a tool in the UI,
     * able to respond to a click by updating the document current tool.
     *
     * Note that this method assumes every tool has a different class (name),
     * as it uses it to identify every single tool selection button in the UI..
     * @param  {Tool}   tool Tool to represent with a tool node.
     * @return {JQuery}      Fresh tool node.
     *
     * @author Camille Gobert
     */
    private static createToolNode (tool: Tool) {
        let toolName      = tool.name;
        let toolClassName = tool.constructor.name;

        let toolButton = $("<button>");
        toolButton.html(toolName);
        toolButton.attr("type", "button");
        toolButton.attr("data-tool-classname", toolClassName);
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
        // Get the clicked tool instance
        let toolClassName = $(event.target).attr("data-tool-classname");

        let tool = this.tools.find((t) => t.constructor.name === toolClassName);
        if (! tool) {
            console.log("Error: tool " + toolClassName + " could not be loaded.");
            return;
        }

        // Update the current tool of the document
        this.document.setCurrentTool(tool);

        console.log("New selected tool:");
        console.log(tool);

        // Notify the UI the tool has changed with an event
        let evt = new CustomEvent("rubens_toolchanged", {bubbles: true});
        this.rootNode[0].dispatchEvent(evt);
    }
}
