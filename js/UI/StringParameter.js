define(["require", "exports", "./Parameter"], function (require, exports, Parameter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * UI element representing a single string parameter.
     */
    class StringParameter extends Parameter_1.Parameter {
        /**
         * Instanciates and initialize a new, empty StringParameter object.
         * @param  {JQuery}          parentNode Parent node owning current instance.
         * @param  {StringParameter} parameter  Parameter to display.
         * @param  {RubEns}          app        Related app instance.
         * @return {StringParameter}            Fresh instance of StringParameter.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app, parameter) {
            super(parentNode, app, parameter);
            this.rootNodeClasses = this.rootNodeClasses + " string_param";
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
        appendControlElement() {
            super.appendControlElement();
            this.controlNode.attr("type", "text");
            if (this.parameter.minLength !== undefined) {
                this.controlNode.attr("minlength", this.parameter.minLength);
            }
            if (this.parameter.maxLength !== undefined) {
                this.controlNode.attr("maxlength", this.parameter.maxLength);
            }
            if (this.parameter.pattern !== undefined) {
                // Convert pattern to string and remove leading and trailing slashes
                let pattern = this.parameter.pattern.toString();
                let patternWithoutSlashes = pattern.substr(1, pattern.length - 2);
                this.controlNode.attr("pattern", patternWithoutSlashes);
            }
        }
    }
    exports.StringParameter = StringParameter;
});
