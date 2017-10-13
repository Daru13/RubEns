import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import * as Params from "../Parameter";
import { Parameter } from "./Parameter";
import { Document } from "../Document";

/**
 * UI element representing a single numerical parameter.
 */
export class NumberParameter extends Parameter {
    protected rootNodeType    = "input";
    protected rootNodeClasses = super.rootNodeClasses + " number_param";

    protected parameter: Params.NumberParameter;

    /**
     * Instanciates and initialize a new, empty NumberParameter object.
     * @param  {JQuery}          parentNode Parent node owning current instance.
     * @param  {NumberParameter} parameter  Parameter to display.
     * @param  {Document}        document   Related document instance.
     * @return {NumberParameter}            Fresh instance of Parameter.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document, parameter: Params.NumberParameter) {
        super(parentNode, document, parameter);
        this.parameter = parameter;

        this.addNodeAttributes();

        this.createRootNode();
        this.appendLabelElement();
    }

    /**
     * Build the internal list of attributes to set to the node HTML element,
     * based on properties of NumberParameter objects.
     *
     * @author Camille Gobert
     */
    private addNodeAttributes () {
        this.rootNodeAttributes["type"]  = "number";
        this.rootNodeAttributes["value"] = this.parameter.value;

        // If specified by the parameter object, add additional attributes
        if (this.parameter.min) {
            this.rootNodeAttributes["min"] = this.parameter.min;
        }

        if (this.parameter.min) {
            this.rootNodeAttributes["max"] = this.parameter.max;
        }

        if (this.parameter.step) {
            this.rootNodeAttributes["step"] = this.parameter.step;
        }
    }

}
