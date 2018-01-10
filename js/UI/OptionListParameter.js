define(["require", "exports", "./Parameter"], function (require, exports, Parameter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * UI element representing a single option list parameter.
     */
    class OptionListParameter extends Parameter_1.Parameter {
        /**
         * Instanciates and initialize a new, empty OptionListParameter object.
         * @param  {JQuery}              parentNode Parent node owning current instance.
         * @param  {OptionListParameter} parameter  Parameter to display.
         * @param  {RubEns}              app        Related app instance.
         * @return {OptionListParameter}            Fresh instance of OptionListParameter.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app, parameter) {
            super(parentNode, app, parameter);
            this.rootNodeClasses = this.rootNodeClasses + " option_list_param";
            this.controlNodeType = "select";
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
            console.log("List of options:");
            console.log(this.parameter.options);
            for (let option of this.parameter.options) {
                let optionNode = $("<option>").html(option);
                this.controlNode.append(optionNode);
                if (option === this.parameter.value) {
                    optionNode.prop("selected", true);
                }
            }
        }
        updateParameterValueFromControlElement() {
            this.parameter.value = this.controlNode.find("option:selected")
                .text();
        }
    }
    exports.OptionListParameter = OptionListParameter;
});
