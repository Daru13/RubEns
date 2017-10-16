import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import * as Params from "../Parameter";
import { Document } from "../Document";

/**
 * Abstract UI element representing a single parameter.
 *
 * It must be extended by one child class per type of parameter, which takes
 * care of displaying the correct information related to the parameter type,
 * and to update the internally linked Parameter value when the user interacts
 * with the UI in order to change it.
 */
export abstract class Parameter extends HTMLRenderer {
    protected rootNodeType    = "div";
    protected rootNodeClasses = "parameter";

    protected document: Document;
    protected parameter: Params.Parameter<any>;

    /**
     * Instanciates and initialize a new Parameter object.
     * This method is only meant to be called from classes extending this one.
     * @param  {JQuery}                parentNode Parent node owning current instance.
     * @param  {Document}              document   Related document instance.
     * @param  {Params.Parameter<any>} parameter  Parameter to display.
     * @return {Parameter}                        Fresh instance of Parameter.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document, parameter: Params.Parameter<any>) {
        super(parentNode);

        this.document  = document;
        this.parameter = parameter;
    }

    /**
     * Create and append a label element containing the parameter name to the root node.
     * If the parameter has no name or an empty name, no label is appended.
     *
     * @author Camille Gobert
     */
    protected appendLabelElement () {
        let parameterName = this.parameter.name;
        if (! parameterName) {
            return;
        }

        console.log("Label to be appended: " + parameterName);
        console.log("To:", this.rootNode);

        let labelNode = $("<label>");
        labelNode.html(parameterName);

        this.rootNode.append(labelNode);
    }

    /**
     * Abstract method meant to create and append an UI element to control the parameter value.
     * It must be implemented by the concrete child classes extending this one.
     *
     * @author Camille Gobert
     */
    protected abstract appendControlElement ();
}
