import * as Params from "../Parameter";
import { Parameter } from "./Parameter";
import { Document } from "../Document";

/**
 * UI element representing a single string parameter.
 */
export class StringParameter extends Parameter {
    protected rootNodeClasses = this.rootNodeClasses + " string_param";

    protected parameter: Params.StringParameter;

    /**
     * Instanciates and initialize a new, empty StringParameter object.
     * @param  {JQuery}          parentNode Parent node owning current instance.
     * @param  {StringParameter} parameter  Parameter to display.
     * @param  {Document}        document   Related document instance.
     * @return {StringParameter}            Fresh instance of StringParameter.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document, parameter: Params.StringParameter) {
        super(parentNode, document, parameter);

        this.controlNodeValue = parameter.value;

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
        this.controlNode.attr("type", "text");

        if (this.parameter.minLength) {
            this.controlNode.attr("minlength", this.parameter.minLength);
        }

        if (this.parameter.maxLength) {
            this.controlNode.attr("maxlength", this.parameter.maxLength);
        }

        if (this.parameter.pattern) {
            // Convert pattern to string and remove leading and trailing slashes
            let pattern               = this.parameter.pattern.toString();
            let patternWithoutSlashes = pattern.substr(1, pattern.length - 2);

            this.controlNode.attr("pattern", patternWithoutSlashes);
        }
    }
}
