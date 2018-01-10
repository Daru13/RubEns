define(["require", "exports", "./HTMLRenderer", "./ToolSelectionMenu"], function (require, exports, HTMLRenderer_1, ToolSelectionMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
    * Main UI element representing the tool menu of the UI.
    *
    * It is meant to display available tools, and allows the user to easily switch between them.
    */
    class ToolMenu extends HTMLRenderer_1.HTMLRenderer {
        /**
         * Instanciates and initializes a new ToolMenu object, and set up the underlying tool selection menu.
         * @param  {JQuery}   parentNode Parent node owning current instance.
         * @param  {RubEns}   app        Related app instance.
         * @return {ToolMenu}            Fresh instance of ToolMenu.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app) {
            super(parentNode);
            this.rootNodeId = "tool_menu";
            this.app = app;
            this.createRootNode();
        }
        /**
         * Create the whole tool menu.
         *
         * @author Camille Gobert
         */
        createRootNode() {
            super.createRootNode();
            this.createTitleNode();
            this.createToolSelectionMenu();
        }
        /**
         * Create the tool selection menu.
         *
         * @author Camille Gobert
         */
        createToolSelectionMenu() {
            this.toolSelectionMenu = new ToolSelectionMenu_1.ToolSelectionMenu(this.rootNode, this.app);
        }
        /**
         * Create the title node.
         *
         * @author Camille Gobert
         */
        createTitleNode() {
            let titleNode = $("<h3>");
            titleNode.html("Tools");
            this.rootNode.append(titleNode);
            this.titleNode = titleNode;
        }
    }
    exports.ToolMenu = ToolMenu;
});
