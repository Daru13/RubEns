define(["require", "exports", "jquery", "./HTMLRenderer"], function (require, exports, $, HTMLRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Abstract UI element representing a single parameter.
     *
     * It must be extended by one child class per type of parameter, which takes
     * care of displaying the correct information related to the parameter type,
     * and to update the internally linked Parameter value when the user interacts
     * with the UI in order to change it.
     */
    class Parameter extends HTMLRenderer_1.HTMLRenderer {
        /**
         * Instanciates and initialize a new Parameter object.
         * This method is only meant to be called from classes extending this one.
         * @param  {JQuery}                parentNode Parent node owning current instance.
         * @param  {RubEns}                app        Related app instance.
         * @param  {Params.Parameter<any>} parameter  Parameter to display.
         * @return {Parameter}                        Fresh instance of Parameter.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app, parameter) {
            super(parentNode);
            this.rootNodeType = "div";
            this.rootNodeClasses = "parameter";
            /**
             * Reference to the control element node.
             */
            this.controlNode = null;
            /**
             * Type of HTML node of the control element node to create.
             */
            this.controlNodeType = "input";
            /**
             * Initial value of the `value` attribute of the control element node.
             *
             * If undefined, no `value` attribute is added to the control element node.
             */
            this.controlNodeValue = undefined;
            /**
             * Reference to the label element node.
             */
            this.labelNode = null;
            /**
             * Event handler callback for control element changes.
             */
            this.parameterChangeHandler = {
                eventTypes: ["change"],
                selector: this.controlNode,
                callback: (event) => { this.onParameterChange(event); }
            };
            this.app = app;
            this.parameter = parameter;
        }
        /**
         * Create and append a label element containing the parameter name to the root node.
         * If the parameter has no name or an empty name, no label is appended.
         *
         * @author Camille Gobert
         */
        appendLabelElement() {
            let parameterName = this.parameter.name;
            if (!parameterName) {
                return;
            }
            let labelNode = $("<label>");
            labelNode.html(parameterName);
            this.rootNode.append(labelNode);
            // Save a reference to the label node
            this.labelNode = labelNode;
        }
        /**
         * Create an UI element to control the parameter value, and append it to the root node.
         * It also updates the parameter change handler selector field to match the newly created node.
         *
         * This method is meant to be overriden by concrete child classes,
         * in order to specialize the control node for the kind of parameter it controls.
         *
         * @author Camille Gobert
         */
        appendControlElement() {
            let controlNode = $("<" + this.controlNodeType + ">");
            // TODO: handle parameter type attribute in this class instead of subclasses
            // numberInput.attr("type", TODO);
            if (this.controlNodeValue) {
                controlNode.attr("value", this.controlNodeValue);
            }
            // Update the oncange callback to match this node
            this.parameterChangeHandler.selector = controlNode;
            this.rootNode.append(controlNode);
            // Save a reference to the control node
            this.controlNode = controlNode;
        }
        /**
         * Update the raw parameter value by retrieving the control element value.
         *
         * @author Camille Gobert
         */
        updateParameterValueFromControlElement() {
            this.parameter.value = this.controlNode.val();
        }
        /**
         * Callback function called whenever the control element value is modified.
         *
         * @author Camille Gobert
         */
        onParameterChange(event) {
            this.updateParameterValueFromControlElement();
        }
        /**
         * Start handling updates of the control element value (via the event manager).
         *
         * @author Camille Gobert
         */
        startHandlingChanges() {
            this.app.eventManager.registerEventHandler(this.parameterChangeHandler);
        }
        /**
         * Stop handling updates of the control element value (via the event manager).
         *
         * @author Camille Gobert
         */
        stopHandlingChanges() {
            this.app.eventManager.unregisterEventHandler(this.parameterChangeHandler);
        }
    }
    exports.Parameter = Parameter;
});
