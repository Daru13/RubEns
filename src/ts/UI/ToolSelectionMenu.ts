import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { Tool } from "../DrawingTools/Tool";
import { Document } from "../Document";

export class ToolSelectionMenu extends HTMLRenderer {
    protected rootNodeId   = "tool_selection_menu";
    protected rootNodeType = "ul";

    private tools: object;
    private document: Document;

    private toolClickEventHandler = {
        eventTypes: ["click"],
        selector: ".tool_button",
        callback: (event) => this.onToolClick(event)
    };

    constructor (parentNode: JQuery, document: Document) {
        super(parentNode);

        this.tools    = [];
        this.document = document;

        this.createRootNode();
        this.updateRootNode();

        this.document.eventManager.registerEventHandler(this.toolClickEventHandler);
    }

    updateRootNode () {
        for (let tool in this.tools) {
            let toolNode = ToolSelectionMenu.createToolNode(this.tools[tool]);
            this.rootNode.append(toolNode);
        }
    }

    setTools (tools: object) {
        this.tools = tools;
        this.updateRootNode();
    }

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

    onToolClick (event: Event) {
        // Get the clicked tool name
        let toolName = $(event.target).attr("id");
        console.log("clicked id: " + toolName);

        this.document.setCurrentDrawingTool(this.tools[toolName]);
    }
}
