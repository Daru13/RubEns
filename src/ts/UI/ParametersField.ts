import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import * as Params from "../Parameter";
import { Parameter } from "./Parameter";
import { NumberParameter } from "./NumberParameter";
import { Document } from "../Document";

/**
 * UI element representing a set of related parameters.
 *
 * It manages a list of parameters represented by instances of Parameters
 * and display them in a single <form> element.s
 */
export class ParametersField extends HTMLRenderer {
    protected rootNodeType    = "form";
    protected rootNodeClasses = "parameters_field";

    private document: Document;

    private parameters: Params.Parameter<any>[];
    private wrappedParameters: Parameter[];

    /**
     * Instanciates and initialize a new, empty ParametersField object.
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

        this.parameters = [];
        this.wrappedParameters = [];
    }
    
    // TODO: clean this code
    private wrapAndDisplayParameter (parameter: Params.Parameter<any>) {
        let wrapperClassesPerType = {
            "number": NumberParameter,
        };

        let parameterType = typeof parameter.value;
        if (! (parameterType in wrapperClassesPerType)) {
            console.log("Parameter of type " + parameterType + " has no wrapper class!");
            return null;
        }

        return new wrapperClassesPerType[parameterType](this.rootNode, this.document, parameter);
    }

    private wrapAndDisplayAllParameters () {
        this.wrappedParameters = [];

        for (let parameter of this.parameters) {
            let wrappedParameter = this.wrapAndDisplayParameter(parameter);
            this.wrappedParameters.push(wrappedParameter);
        }
    }

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
        this.parameters = [];

        this.updateRootNode();
    }
}
