import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import * as Params from "../Parameter";
import { Parameter } from "./Parameter";
import { NumberParameter } from "./NumberParameter";
import { StringParameter } from "./StringParameter";
import { ColorParameter } from "./ColorParameter";
import { Document } from "../Document";

/**
 * UI element representing a set of related parameters.
 *
 * It manages a list of parameters represented by instances of Parameters
 * and display them in a single <form> element.
 */
export class ParametersField extends HTMLRenderer {
    protected rootNodeType    = "form";
    protected rootNodeClasses = "parameters_field";

    /**
     * Related document instance.
     */
    private document: Document;

    /**
     * List of parameters (of any type) which should be displayed by the UI.
     */
    private parameters: Params.Parameter<any>[];

    /**
     * List of UI parameter objects actually displayed in the UI.
     */
    private wrappedParameters: Parameter[];

    /**
     * Instanciates and initializes a new, empty ParametersField object.
     * @param  {JQuery}   parentNode Parent node owning current instance.
     * @param  {Document} document   Related document instance.
     * @return {ParametersField}     Fresh instance of Parameter.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document) {
        super(parentNode);
        this.createRootNode();

        this.document = document;

        this.parameters        = [];
        this.wrappedParameters = [];
    }

    /**
     * Wrap a parameter into an UI parameter, whose root node is appended to
     * the current root node, and thus displayed once created.
     * @param  {Params.Parameter<any>} parameter Parameter to wrap.
     * @return {Parameter}                       UI parameter (wrapper).
     *
     * @author Camille Gobert
     */
    private wrapAndDisplayParameter (parameter: Params.Parameter<any>) {
        // TODO: do it differently?

        let wrapperClassesPerKind = {
            "number": NumberParameter,
            "string": StringParameter,
            "color": ColorParameter
        };

        let parameterKind = parameter.kind;
        if (! (parameterKind in wrapperClassesPerKind)) {
            console.log("Parameter of kind " + parameterKind + " has no wrapper class!");
            return null;
        }

        // Wrap the raw parameter in an UI parameter
        let wrappedParameter = new wrapperClassesPerKind[parameterKind](this.rootNode, this.document, parameter);

        // Start handling parameter changes
        wrappedParameter.startHandlingChanges();

        return wrappedParameter;
    }

    /**
     * Wrap all non-hidden parameter into UI parameters, using the
     * [[wrapAndDisplayParameter]] method, and save them into the related attribute.
     *
     * @author Camille Gobert
     */
    private wrapAndDisplayAllParameters () {
        this.wrappedParameters = [];

        for (let parameter of this.parameters) {
            if (parameter.hidden) {
                continue;
            }

            let wrappedParameter = this.wrapAndDisplayParameter(parameter);
            this.wrappedParameters.push(wrappedParameter);
        }
    }

    /**
     * Empty the root node and re-wrap and append all parameters.
     *
     * @author Camille Gobert
     */
    updateRootNode () {
        this.rootNode.empty();
        this.wrapAndDisplayAllParameters();
    }

    /**
     * Returns the index of the given parameter, or -1 if it does not belong
     * to the internal list of parameters.
     * @param  {Parameter<any>} parameter The parameter whose index is sought.
     * @return {number}                   The index of the given parameter.
     *
     * @author Camille Gobert
     */
    private getParameterIndex (parameter: Params.Parameter<any>) {
        return this.parameters.findIndex((p) => parameter === p);
    }

    /**
     * Add a parameter at the end of the internal list of parameters,
     * and update the view to reflect the changes.
     * @param  {Parameter<any>} parameter Parameter to add.
     *
     * @author Camille Gobert
     */
    addParameter (parameter: Params.Parameter<any>) {
        this.parameters.push(parameter);

        this.updateRootNode();
    }

    /**
     * Remove a parameter from the internal list of parameters,
     * and update the view to reflect the changes.
     * @param  {Parameter<any>} parameter Parameter to remove.
     * @return {boolean}                  true if the parameter was found and removed,
     *                                    false otherwise.
     *
     * @author Camille Gobert
     */
    removeParameter (parameter: Params.Parameter<any>) {
        let parameterIndex = this.getParameterIndex(parameter);
        if (parameterIndex < 0) {
            return false;
        }

        this.updateRootNode();
        return true;
    }

    /**
     * Empty the internal list of parameters, and update the view to reflect the changes.
     *
     * @author Camille Gobert
     */
    clearParameters () {
        // Remove all event handlers before clearing UI parameters
        for (let wrappedParameter of this.wrappedParameters) {
            wrappedParameter.stopHandlingChanges();
        }

        // Clear the list of parameters once it is done
        this.parameters = [];

        this.updateRootNode();
    }
}
