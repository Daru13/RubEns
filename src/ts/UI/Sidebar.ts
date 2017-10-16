import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { ParametersField } from "./ParametersField";
import { Document } from "../Document";

import * as Params from "../Parameter";
import { NumberParameter } from "./NumberParameter";

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
        this.currentToolParametersField = null;

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
            name: "My awesome number parameter",
            min: -42,
            max: 42,
            step: 2
        };

        let param2 = {
            value: 50,
            name: "",
            min: 0,
            max: 100,
            step: 0.5
        };

        let param3 = {
            value: "FooBar",
            name: "Baz"
        };

        this.globalParametersField.addParameter(param1);
        this.globalParametersField.addParameter(param2);

        this.globalParametersField.addParameter(param3);
    }

    /**
     * Update the current tool parameters field.
     *
     * @author Camille Gobert
     */
    updateCurrentToolParametersField () {
        // TODO
    }
}
