import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { ParametersField } from "./ParametersField";
import { Document } from "../Document";

import * as Params from "../Parameter";
import { NumberParameter } from "./NumberParameter";
import { Color } from "../utils/Color";

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
                console.log("rubens_toolchanged catched");
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
        // Temporary debug code
        let param1 = {
            value: 0,
            kind: Params.ParameterKind.Number,
            name: "My awesome number parameter",
            min: -42,
            max: 42,
            step: 2
        };

        let param2 = {
            value: 50,
            kind: Params.ParameterKind.Number,
            name: "",
            min: 0,
            max: 100,
            step: 0.5
        };

        this.globalParametersField.addParameter(param1);
        this.globalParametersField.addParameter(param2);

        let param3 = {
            value: "FooBar",
            kind: Params.ParameterKind.String,
            name: "Baz",
            hidden: true
        };

        let param4 = {
            value: "Test string",
            kind: Params.ParameterKind.String,
            name: "Test string input",
            minLength: 4,
            maxLength: 16,
            pattern: /[a-zA-Z]/
        };

        this.globalParametersField.addParameter(param3);
        this.globalParametersField.addParameter(param4);

        let param5: Params.ColorParameter = {
            value: "red",
            kind: Params.ParameterKind.Color,
            name: "Color selector"
        };

        this.globalParametersField.addParameter(param5);
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
