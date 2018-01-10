define(["require", "exports", "./HTMLRenderer", "./ParametersField", "./HistoryList", "./LayerList"], function (require, exports, HTMLRenderer_1, ParametersField_1, HistoryList_1, LayerList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Main UI element representing the sidebar of the GUI.
     *
     * It can contain several sub-elements, such as parameters fields, and should be
     * updated in order to always display fresh and relevant information to the user.
     */
    class Sidebar extends HTMLRenderer_1.HTMLRenderer {
        /**
         * Instanciates and initializes a new Sidebar object and its sub-modules.
         * @param  {JQuery}  parentNode Parent node owning current instance.
         * @param  {RubEns}  app        Related app instance.
         * @return {Sidebar}            Fresh instance of Sidebar.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app) {
            super(parentNode);
            this.rootNodeId = "sidebar";
            /**
             * Event handler for tool changes.
             */
            this.toolChangedEventHandler = {
                eventTypes: ["rubens_toolChanged"],
                callback: (event) => {
                    this.updateCurrentToolParametersField();
                }
            };
            /**
             * Event handler for document or parameter changes.
             */
            this.documentOrParametersChangedEventHandler = {
                eventTypes: ["rubens_documentCreated", "rubens_documentClosed", "rubens_globalParameterChanged"],
                callback: (event) => {
                    this.updateRootNode();
                }
            };
            this.createRootNode();
            this.app = app;
            this.globalParametersField = new ParametersField_1.ParametersField(this.rootNode, app, "Tool parameters");
            this.currentToolParametersField = new ParametersField_1.ParametersField(this.rootNode, app);
            this.historyList = new HistoryList_1.HistoryList(this.rootNode, app);
            this.layerList = new LayerList_1.LayerList(this.rootNode, app);
            this.registerEventHandler();
            this.updateRootNode();
        }
        /**
         * Update all sub-modules of the sidebar.
         *
         * @author Camille Gobert
         */
        updateRootNode() {
            this.updateGlobalParametersField();
            this.updateCurrentToolParametersField();
            this.historyList.updateRootNode();
        }
        /**
         * Update the global parameters field.
         * If the
         *
         * @author Camille Gobert
         */
        updateGlobalParametersField() {
            this.globalParametersField.clearParameters();
            if (!this.app.document) {
                return;
            }
            let sharedToolParameters = this.app.document.parameters.sharedToolParameters;
            this.globalParametersField.addAllParameters(Object.keys(sharedToolParameters)
                .map((key) => sharedToolParameters[key]));
        }
        /**
         * Update the current tool parameters field.
         *
         * This method looks for parameters in the document current tool.
         * If there is no current tool, no current tool parameters are displayed.
         * @author Camille Gobert
         */
        updateCurrentToolParametersField() {
            this.currentToolParametersField.clearParameters();
            if (!this.app.document) {
                return;
            }
            let currentTool = this.app.document.getCurrentTool();
            if (!currentTool) {
                return;
            }
            let currentToolParameters = currentTool.parameters;
            this.currentToolParametersField.addAllParameters(Object.keys(currentToolParameters)
                .map((key) => currentToolParameters[key]));
        }
        /**
         * Register all event handlers to the event manager.
         *
         * @author Camille Gobert
         */
        registerEventHandler() {
            this.app.eventManager.registerEventHandler(this.toolChangedEventHandler);
            this.app.eventManager.registerEventHandler(this.documentOrParametersChangedEventHandler);
        }
        /**
         * Unregister all event handlers to the event manager.
         *
         * @author Camille Gobert
         */
        unregisterEventHandler() {
            this.app.eventManager.unregisterEventHandler(this.toolChangedEventHandler);
            this.app.eventManager.unregisterEventHandler(this.documentOrParametersChangedEventHandler);
        }
    }
    exports.Sidebar = Sidebar;
});
