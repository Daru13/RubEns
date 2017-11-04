import * as Params from "../Parameter";
import { Parameter } from "./Parameter";
import { Document } from "../Document";

/**
 * UI element representing a single string parameter.
 */
export class ColorParameter extends Parameter {
    protected rootNodeClasses = this.rootNodeClasses + " color_param";

    protected parameter: Params.ColorParameter;

    /**
     * Instanciates and initialize a new, empty ColorParameter object.
     * @param  {JQuery}         parentNode Parent node owning current instance.
     * @param  {ColorParameter} parameter  Parameter to display.
     * @param  {Document}       document   Related document instance.
     * @return {ColorParameter}            Fresh instance of ColorParameter.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document, parameter: Params.ColorParameter) {
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
        this.controlNode.attr("type", "color");
    }
}
