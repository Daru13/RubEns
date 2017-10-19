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
        let numberInput = $("<input>");

        numberInput.attr("type", "number");
        numberInput.attr("value", this.parameter.value);

        if (this.parameter.min) {
            numberInput.attr("min", this.parameter.min);
        }

        if (this.parameter.max) {
            numberInput.attr("max", this.parameter.max);
        }

        if (this.parameter.step) {
            numberInput.attr("step", this.parameter.step);
        }

        this.rootNode.append(numberInput);
    }
}
