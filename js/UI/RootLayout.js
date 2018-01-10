define(["require", "exports", "./MainMenu", "./DrawingDisplay", "./Sidebar", "./StatusBar", "./ToolMenu", "./HTMLRenderer"], function (require, exports, MainMenu_1, DrawingDisplay_1, Sidebar_1, StatusBar_1, ToolMenu_1, HTMLRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This class represents the root of the UI, which instanciates and communicate
     * each sub-module of the UI.
     */
    class RootLayout extends HTMLRenderer_1.HTMLRenderer {
        /**
         * Instanciates a new RootLayout, and initializes its sub-modules
         * @param parentNode  Parent HTML node where to set up the UI.
         * @param app         Related app instance.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app) {
            super(parentNode);
            this.rootNodeId = "root_layout";
            this.createRootNode();
            this.mainMenu = new MainMenu_1.MainMenu(this.rootNode, app);
            this.drawingDisplay = new DrawingDisplay_1.DrawingDisplay(this.rootNode, app);
            this.sidebar = new Sidebar_1.Sidebar(this.rootNode, app);
            this.statusBar = new StatusBar_1.StatusBar(this.rootNode, app);
            this.toolMenu = new ToolMenu_1.ToolMenu(this.rootNode, app);
        }
    }
    exports.RootLayout = RootLayout;
});
