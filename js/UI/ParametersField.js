define(["require", "exports", "./HTMLRenderer", "./NumberParameter", "./StringParameter", "./ColorParameter", "./OptionListParameter"], function (require, exports, HTMLRenderer_1, NumberParameter_1, StringParameter_1, ColorParameter_1, OptionListParameter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * UI element representing a set of related parameters.
     *
     * It manages a list of parameters represented by instances of Parameters
     * and display them in a single <form> element.
     */
    class ParametersField extends HTMLRenderer_1.HTMLRenderer {
        /**
         * Instanciates and initializes a new, empty ParametersField object.
         * @param  {JQuery}   parentNode Parent node owning current instance.
         * @param  {RubEns}   app        Related app instance.
         * @param  {string}   title      Optionnal title (none by default).
         * @return {ParametersField}     Fresh instance of Parameter.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app, title = "") {
            super(parentNode);
            this.rootNodeType = "form";
            this.rootNodeClasses = "parameters_field";
            this.createRootNode();
            this.app = app;
            this.title = title;
            this.parameters = [];
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
        wrapAndDisplayParameter(parameter) {
            // Wrap the raw parameter in an UI parameter
            //  Kinda dirty fix using a switch statement for fixing an issue in Travis...
            let parameterKind = parameter.kind;
            let wrappedParameter = null;
            switch (parameterKind) {
                case "number":
                    wrappedParameter = new NumberParameter_1.NumberParameter(this.rootNode, this.app, parameter);
                    break;
                case "string":
                    wrappedParameter = new StringParameter_1.StringParameter(this.rootNode, this.app, parameter);
                    break;
                case "color":
                    wrappedParameter = new ColorParameter_1.ColorParameter(this.rootNode, this.app, parameter);
                    break;
                case "optionList":
                    wrappedParameter = new OptionListParameter_1.OptionListParameter(this.rootNode, this.app, parameter);
                    break;
            }
            if (!wrappedParameter) {
                console.log("Parameter of kind " + parameterKind + " has no wrapper class!");
                return null;
            }
            wrappedParameter.startHandlingChanges();
            return wrappedParameter;
        }
        /**
         * Wrap all non-hidden parameter into UI parameters, using the
         * [[wrapAndDisplayParameter]] method, and save them into the related attribute.
         *
         * @author Camille Gobert
         */
        wrapAndDisplayAllParameters() {
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
         * Empty the root node and re-wrap and append the (optionnal) title + all parameters.
         *
         * @author Camille Gobert
         */
        updateRootNode() {
            this.stopHandlingAllChanges();
            this.rootNode.empty();
            this.createTitleNode();
            this.wrapAndDisplayAllParameters();
            this.updateRootNodeEmptyClass();
        }
        /**
         * Create the title node.
         *
         * @author Camille Gobert
         */
        createTitleNode() {
            let titleNode = $("<h3>");
            titleNode.html(this.title);
            this.rootNode.append(titleNode);
            this.titleNode = titleNode;
            this.updateTitleNode();
        }
        /**
         * Update the title node, so it matches the parameters field title.
         * If the title is empty, it hides the title node.
         *
         * @author Camille Gobert
         */
        updateTitleNode() {
            if (this.title === "") {
                this.titleNode.hide();
                return;
            }
            this.titleNode.html(this.title);
            this.titleNode.show();
        }
        /**
         * Set the title of the parameters field, and update the UI accordingly.
         * If the new title is empty, it hides the title node.
         * @param  {string} title The new title.
         *
         * @author Camille Gobert
         */
        setTitle(title) {
            this.title = title;
            this.updateTitleNode();
        }
        /**
         * Returns the index of the given parameter, or -1 if it does not belong
         * to the internal list of parameters.
         * @param  {Parameter<any>} parameter The parameter whose index is sought.
         * @return {number}                   The index of the given parameter.
         *
         * @author Camille Gobert
         */
        getParameterIndex(parameter) {
            return this.parameters.findIndex((p) => parameter === p);
        }
        /**
         * Add a parameter at the end of the internal list of parameters,
         * and update the view to reflect the changes.
         * @param  {Parameter<any>} parameter Parameter to add.
         *
         * @author Camille Gobert
         */
        addParameter(parameter) {
            this.parameters.push(parameter);
            this.updateRootNode();
        }
        /**
         * Add all given parameters at the end of the internal list of parameters,
         * and update the view to reflect the changes.
         * @param {Iterable<Params.Parameter<any>>} parameters Iterable set of parameters to add.
         *
         * @author Camille Gobert
         */
        addAllParameters(parameters) {
            for (let parameter of parameters) {
                this.parameters.push(parameter);
            }
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
        removeParameter(parameter) {
            let parameterIndex = this.getParameterIndex(parameter);
            if (parameterIndex < 0) {
                return false;
            }
            this.parameters.splice(parameterIndex, 1);
            this.updateRootNode();
            return true;
        }
        /**
         * Empty the internal list of parameters, and update the view to reflect the changes.
         *
         * @author Camille Gobert
         */
        clearParameters() {
            // Remove all event handlers before clearing UI parameters
            this.stopHandlingAllChanges();
            // Clear the list of parameters once it is done
            this.parameters = [];
            this.updateRootNode();
        }
        /**
         * Stop handling changes in all wrapped parameters.
         *
         * @author Camille Gobert
         */
        stopHandlingAllChanges() {
            for (let wrappedParameter of this.wrappedParameters) {
                wrappedParameter.stopHandlingChanges();
            }
        }
        /**
         * Update the `empty` class of the node, depending on the number of parameters in the field.
         * The class is presented if and only if the set of parameters is empty.
         *
         * @author Camille Gobert
         */
        updateRootNodeEmptyClass() {
            if (this.parameters.length === 0) {
                this.rootNode.addClass("empty");
            }
            else {
                this.rootNode.removeClass("empty");
            }
        }
    }
    exports.ParametersField = ParametersField;
});
