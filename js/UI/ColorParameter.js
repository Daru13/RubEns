define(["require", "exports", "./Parameter"], function (require, exports, Parameter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * UI element representing a single string parameter.
     */
    class ColorParameter extends Parameter_1.Parameter {
        /**
         * Instanciates and initialize a new, empty ColorParameter object.
         * @param  {JQuery}         parentNode Parent node owning current instance.
         * @param  {ColorParameter} parameter  Parameter to display.
         * @param  {RubEns}         app        Related app instance.
         * @return {ColorParameter}            Fresh instance of ColorParameter.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app, parameter) {
            super(parentNode, app, parameter);
            this.rootNodeClasses = this.rootNodeClasses + " color_param";
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
            this.controlNode.attr("type", "color");
        }
    }
    exports.ColorParameter = ColorParameter;
});
