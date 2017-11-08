import * as Params from "../Parameter";
import { Parameter } from "./Parameter";
import { RubEns } from "../RubEns";

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
     * @param  {RubEns}         app        Related app instance.
     * @return {ColorParameter}            Fresh instance of ColorParameter.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, app: RubEns, parameter: Params.ColorParameter) {
        super(parentNode, app, parameter);

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
