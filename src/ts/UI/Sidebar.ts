import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { ParametersField } from "./ParametersField";
import { RubEns } from "../RubEns";
import { HistoryList } from "./HistoryList";

/**
 * Main UI element representing the sidebar of the GUI.
 *
 * It can contain several sub-elements, such as parameters fields, and should be
 * updated in order to always display fresh and relevant information to the user.
 */
export class Sidebar extends HTMLRenderer {
    protected rootNodeId = "sidebar";

    /**
     * Related app instance.
     */
    app: RubEns;

    /**
     * Instance of the global parameters field.
     */
    globalParametersField: ParametersField;

    /**
     * Instance of the current tool parameters field.
     */
    currentToolParametersField: ParametersField;

    /**
     * Instance of the history list.
     */
    historyList: HistoryList;

    /**
     * Instanciates and initializes a new Sidebar object and its sub-modules.
     * @param  {JQuery}  parentNode Parent node owning current instance.
     * @param  {RubEns}  app        Related app instance.
     * @return {Sidebar}            Fresh instance of Sidebar.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, app: RubEns) {
        super(parentNode);
        this.createRootNode();

        this.app = app;

        this.globalParametersField      = new ParametersField(this.rootNode, app, "Tool parameters");
        this.currentToolParametersField = new ParametersField(this.rootNode, app);
        this.historyList                = new HistoryList(this.rootNode, app);

        // TODO: move the handlers elsewhere!
        this.app.eventManager.registerEventHandler({
            eventTypes: ["rubens_toolChanged"],
            callback: (event) => {
                this.updateCurrentToolParametersField();
        }});

        this.app.eventManager.registerEventHandler({
            eventTypes: ["rubens_documentCreated", "rubens_documentClosed"],
            callback: (event) => {
                this.updateRootNode();
        }});

        this.updateRootNode();
    }

    /**
     * Update all sub-modules of the sidebar.
     *
     * @author Camille Gobert
     */
    updateRootNode () {
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
    updateGlobalParametersField () {
        this.globalParametersField.clearParameters();

        if (! this.app.document) {
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
    updateCurrentToolParametersField () {
        this.currentToolParametersField.clearParameters();

        if (! this.app.document) {
            return;
        }

        let currentTool = this.app.document.getCurrentTool();
        if (! currentTool) {
            return;
        }

        let currentToolParameters = currentTool.parameters;
        this.currentToolParametersField.addAllParameters(Object.keys(currentToolParameters)
                                                               .map((key) => currentToolParameters[key]));
    }
}
