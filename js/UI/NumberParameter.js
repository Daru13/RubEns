define(["require", "exports", "./Parameter"], function (require, exports, Parameter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * UI element representing a single numerical parameter.
     */
    class NumberParameter extends Parameter_1.Parameter {
        /**
         * Instanciates and initialize a new, empty NumberParameter object.
         * @param  {JQuery}          parentNode Parent node owning current instance.
         * @param  {NumberParameter} parameter  Parameter to display.
         * @param  {RubEns}          app        Related app instance.
         * @return {NumberParameter}            Fresh instance of NumberParameter.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app, parameter) {
            super(parentNode, app, parameter);
            this.rootNodeClasses = this.rootNodeClasses + " number_param";
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
        appendControlElement() {
            super.appendControlElement();
            this.controlNode.attr("type", "number");
            if (this.parameter.min !== undefined) {
                this.controlNode.attr("min", this.parameter.min);
            }
            if (this.parameter.max !== undefined) {
                this.controlNode.attr("max", this.parameter.max);
            }
            if (this.parameter.step !== undefined) {
                this.controlNode.attr("step", this.parameter.step);
            }
        }
        /**
         * Update the raw parameter value by retrieving and parsing the control element value.
         *
         * @author Camille Gobert
         */
        updateParameterValueFromControlElement() {
            let newParameterValue = this.controlNode.val();
            this.parameter.value = parseFloat(newParameterValue);
        }
    }
    exports.NumberParameter = NumberParameter;
});
