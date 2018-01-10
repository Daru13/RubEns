define(["require", "exports", "jquery", "./HTMLRenderer", "../EventManager"], function (require, exports, $, HTMLRenderer_1, EventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * UI element representing the tool selection menu.
     *
     * It manages a list of tools, defined elsewhere, and handles the change of current tool,
     * as well as (un)installing the related event handlers.
     */
    class ToolSelectionMenu extends HTMLRenderer_1.HTMLRenderer {
        /**
         * Instanciates and initializes a new ToolSelectionMenu object,
         * and set up the related click event handler.
         * @param  {JQuery}            parentNode Parent node owning current instance.
         * @param  {RubEns}            app        Related app intance.
         * @return {ToolSelectionMenu}            Fresh instance of ToolSelectionMenu.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app) {
            super(parentNode);
            this.rootNodeId = "tool_selection_menu";
            this.rootNodeType = "ul";
            /**
             * Event handler callback meant to be called when a click occurs on a tool.
             */
            this.toolClickEventHandler = {
                eventTypes: ["click"],
                selector: ".tool_button",
                callback: (event) => this.onToolClick(event)
            };
            this.tools = [];
            this.app = app;
            this.createRootNode();
            this.updateRootNode();
            this.app.eventManager.registerEventHandler(this.toolClickEventHandler);
            this.app.eventManager.registerEventHandler({
                eventTypes: ["rubens_documentCreated"],
                callback: (event) => {
                    $(".tool_button").prop("disabled", false);
                }
            });
            this.app.eventManager.registerEventHandler({
                eventTypes: ["rubens_documentClosed"],
                callback: (event) => {
                    $(".tool_button").prop("disabled", true);
                    $(".tool_button.selected").removeClass("selected");
                }
            });
        }
        /**
         * Empty the root node, and create and append a tool node for each known tool.
         *
         * @author Camille Gobert
         */
        updateRootNode() {
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
        setTools(tools) {
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
        static createToolNode(tool) {
            let toolName = tool.name;
            let toolClassName = tool.constructor.name;
            let toolButton = $("<button>");
            toolButton.attr("type", "button");
            toolButton.attr("data-tool-classname", toolClassName);
            toolButton.attr("title", toolName);
            toolButton.addClass("tool_button");
            // A tool is initially disabled
            toolButton.prop("disabled", true);
            let toolNode = $("<li>");
            toolNode.append(toolButton);
            return toolNode;
        }
        /**
         * Method which must be called when a click occurs on a tool node.
         * If there is no current document, only updates the selected state of the tools.
         * @param  {Event}  event Related click event.
         *
         * @author Camille Gobert
         */
        onToolClick(event) {
            if (!this.app.document) {
                return;
            }
            // Get the clicked tool instance
            let toolClassName = $(event.target).attr("data-tool-classname");
            let tool = this.tools.find((t) => t.constructor.name === toolClassName);
            if (!tool) {
                console.log("Error: tool " + toolClassName + " could not be loaded.");
                return;
            }
            // Update the class of the previously/currently selected tools
            $(".tool_button.selected").removeClass("selected");
            $(event.target).addClass("selected");
            // Update the current tool of the document
            this.app.document.setCurrentTool(tool);
            // Notify the UI the tool has changed with an event
            EventManager_1.EventManager.spawnEvent("rubens_toolChanged", { tool: tool });
        }
    }
    exports.ToolSelectionMenu = ToolSelectionMenu;
});
