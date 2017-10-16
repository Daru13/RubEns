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

    document: Document;

    globalParametersField: ParametersField;
    currentToolParametersField: ParametersField;

    /**
     * Instanciates and initialize a new, empty Sidebar object.
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

    updateRootNode () {
        this.updateGlobalParametersField();
        this.updateCurrentToolParametersField();
    }

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

    updateCurrentToolParametersField () {
        // TODO
    }
}
