import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import * as Params from "../Parameter";
import { Parameter } from "./Parameter";
import { Document } from "../Document";

/**
 * UI element representing a single numerical parameter.
 */
export class NumberParameter extends Parameter {
    protected rootNodeClasses = this.rootNodeClasses + " number_param";

    protected parameter: Params.NumberParameter;

    /**
     * Instanciates and initialize a new, empty NumberParameter object.
     * @param  {JQuery}          parentNode Parent node owning current instance.
     * @param  {NumberParameter} parameter  Parameter to display.
     * @param  {Document}        document   Related document instance.
     * @return {NumberParameter}            Fresh instance of NumberParameter.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document, parameter: Params.NumberParameter) {
        super(parentNode, document, parameter);

        this.controlNodeValue = parameter.value.toString();

        this.createRootNode();
        this.appendLabelElement();
        this.appendControlElement();
    }

    /**
     * Create an element allowing the user to control the value of the parameter,
     * and append it to the root node.
     *
     * @author Camille Gobert
     */
    protected appendControlElement () {
        super.appendControlElement();
        this.controlNode.attr("type", "number");

        if (this.parameter.min) {
            this.controlNode.attr("min", this.parameter.min);
        }

        if (this.parameter.max) {
            this.controlNode.attr("max", this.parameter.max);
        }

        if (this.parameter.step) {
            this.controlNode.attr("step", this.parameter.step);
        }
    }

    /**
     * Update the raw parameter value by retrieving and parsing the control element value.
     *
     * @author Camille Gobert
     */
    updateParameterValueFromControlElement () {
        let newParameterValue = <string> this.controlNode.val();
        this.parameter.value = parseFloat(newParameterValue);
    }
}
