import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { ParametersField } from "./ParametersField";
import { Document } from "../Document";

/**
 * Main UI element representing the sidebar of the GUI.
 *
 * It can contain several sub-elements, such as parameters fields, and should be
 * updated in order to always display fresh and relevant information to the user.
 */
export class Sidebar extends HTMLRenderer {
    protected rootNodeId = "sidebar";

    /**
     * Related document instance.
     */
    document: Document;

    /**
     * Instance of the global parameters field.
     */
    globalParametersField: ParametersField;

    /**
     * Instance of the current tool parameters field.
     */
    currentToolParametersField: ParametersField;

    /**
     * Instanciates and initializes a new Sidebar object and its sub-modules.
     * @param  {JQuery}   parentNode Parent node owning current instance.
     * @param  {Document} document   Related document instance.
     * @return {Sidebar}             Fresh instance of Sidebar.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document) {
        super(parentNode);
        this.createRootNode();

        this.document = document;

        this.globalParametersField      = new ParametersField(this.rootNode, document);
        this.currentToolParametersField = new ParametersField(this.rootNode, document);

        // TODO: move this elsewhere?
        this.document.eventManager.registerEventHandler({
            eventTypes: ["rubens_toolchanged"],
            selector: $("body"),
            callback: (event) => {
                this.updateCurrentToolParametersField();
        }});

        // TODO: remove debug handler
        this.document.eventManager.registerEventHandler({
            eventTypes: ["rubens_globalparameterschanged"],
            selector: "*",
            callback: (event) => {
                console.log("pouet");
                this.updateGlobalParametersField();
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
    }

    /**
     * Update the global parameters field.
     *
     * @author Camille Gobert
     */
    updateGlobalParametersField () {
        this.globalParametersField.clearParameters();

        let sharedToolParameters = this.document.parameters.sharedToolParameters;
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

        let currentTool = this.document.getCurrentTool();
        if (! currentTool) {
            return;
        }

        let currentToolParameters = currentTool.parameters;
        this.currentToolParametersField.addAllParameters(Object.keys(currentToolParameters)
                                                               .map((key) => currentToolParameters[key]));
    }
}
