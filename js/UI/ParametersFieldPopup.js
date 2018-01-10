define(["require", "exports", "jquery", "./Popup", "./ParametersField"], function (require, exports, $, Popup_1, ParametersField_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Set of parameters used by [[ParametersFieldPopup]].
     * Default values of those parameters are defined in the class implementation.
     */
    class ParametersFieldPopupParameters extends Popup_1.PopupParameters {
        constructor() {
            super(...arguments);
            /**
             * By default, hide the standard close button.
             *
             * Closing the popup should be done by accepting or rejecting the changes,
             * using one of the two dedicated buttons (resp. ok and cancel)
             */
            this.displayCloseButton = false;
            /**
             * If set to `true`, display a cancel button on the popup.
             */
            this.displayCancelButton = true;
            /**
             * If set to `true`, display a ok button on the popup.
             */
            this.displayOkButton = true;
        }
    }
    exports.ParametersFieldPopupParameters = ParametersFieldPopupParameters;
    /**
     * Specific UI element representing a popup containing a field of parameters.
     * It may also contain additional controls and a message.
     *
     * The given parameters (so-called *parameters to display*) are **internally copied**,
     * so that **the field of parameter only manipulates a copy**.
     * This allows easy cancelation of the parameter changes (e.g. if the user clicks the cancel button);
     * and the actual parameters are only modified by replacing their values upon validation (e.g. if the user clicks the ok button).
     */
    class ParametersFieldPopup extends Popup_1.Popup {
        /**
         * Instanciates and initializes an empty, new ParametersFieldPopup object.
         * @param  {JQuery}                          parentNode          Parent node owning current instance.
         * @param  {RubEns}                          app                 Related app instance.
         * @param  {ParametersFieldPopupParameters}  parameters          Set of parameters of the popup.
         * @param  {Iterable<Params.Parameter<any>>} parametersToDisplay Set of parameters to display.
         * @param  {string}                          title               Optionnal title of the popup.
         * @param  {string}                          message             Optionnal message of the popup.
         * @return {ParametersFieldPopup}                                Fresh instance of ParametersFieldPopup.
         *
         * @author Camille Gobert
         */
        constructor(parentNode, app, parameters, parametersToDisplay, title, message) {
            super(parentNode, app, parameters, title);
            this.rootNodeClasses = super.rootNodeClasses + " param_field_popup";
            /**
             * Event handler for a click on the cancel button.
             */
            this.cancelButtonClickHandler = {
                eventTypes: ["click"],
                selector: ".popup_cancel_button",
                callback: (_) => { this.onCancelButtonClick(); }
            };
            /**
             * Event handler for a click on the OK button.
             */
            this.okButtonClickHandler = {
                eventTypes: ["click"],
                selector: ".popup_ok_button",
                callback: (_) => { this.onOkButtonClick(); }
            };
            this.parametersToDisplay = parametersToDisplay;
            this.message = message;
            this.createContentNode();
        }
        /**
         * Create and initialize the content node.
         *
         * It also create and append to the latter all the required sub-nodes,
         * depending on some parameters and initial values.
         *
         * @author Camille Gobert
         */
        createContentNode() {
            let contentNode = $("<div>");
            this.setContentNode(contentNode);
            // Add a message if required
            if (this.message) {
                this.createMessageNode();
            }
            // Create and set up the parameter field
            this.createParameterField();
            // Add control buttons if required
            this.createControlWrapper();
            if (this.parameters.displayCancelButton) {
                this.createCancelButton();
            }
            if (this.parameters.displayOkButton) {
                this.createOkButton();
            }
        }
        /**
         * Create and initialize the parameter field.
         *
         * Note: this method takes care of making a deep copy of the parameter set,
         * which is the one actually used by the parameter field.
         *
         * @author Camille Gobert
         */
        createParameterField() {
            // Note: this kinda ugly technique appears to possibly be the fastest easy/generic way
            // (i.e. https://stackoverflow.com/a/5344074)
            let parametersToDisplayCopy = JSON.parse(JSON.stringify(this.parametersToDisplay));
            this.parametersToDisplayCopy = parametersToDisplayCopy;
            this.parametersField = new ParametersField_1.ParametersField(this.contentNode, this.app);
            this.parametersField.addAllParameters(parametersToDisplayCopy);
        }
        /**
         * Create and initialize the message node.
         * It simply wraps the message in a paragraph.
         *
         * @author Camille Gobert
         */
        createMessageNode() {
            let messageNode = $("<p>");
            messageNode.addClass("popup_message");
            messageNode.html(this.message);
            this.messageNode = messageNode;
            this.contentNode.append(messageNode);
        }
        /**
         * Create and initialize the button wrapper node.
         * It is meant to contain the additional control buttons of the popup.
         *
         * @author Camille Gobert
         */
        createControlWrapper() {
            let controlWrapperNode = $("<div>");
            controlWrapperNode.addClass("popup_control_wrapper");
            this.controlWrapperNode = controlWrapperNode;
            this.contentNode.append(controlWrapperNode);
        }
        /**
         * Create and initialize the cancel button node.
         *
         * @author Camille Gobert
         */
        createCancelButton() {
            let cancelButtonNode = $("<button>");
            cancelButtonNode.attr("type", "button");
            cancelButtonNode.addClass("popup_cancel_button");
            cancelButtonNode.html("Cancel");
            this.cancelButtonNode = cancelButtonNode;
            this.controlWrapperNode.append(cancelButtonNode);
        }
        /**
         * Create and initialize the ok button node.
         *
         * @author Camille Gobert
         */
        createOkButton() {
            let okButtonNode = $("<button>");
            okButtonNode.attr("type", "button");
            okButtonNode.addClass("popup_ok_button");
            okButtonNode.html("OK");
            this.okButtonNode = okButtonNode;
            this.controlWrapperNode.append(okButtonNode);
        }
        /**
         * Apply the modifications of the copied set of parameters to the real set.
         * In other words, it copies displayed, copied parameters values to the internally saved, original set.
         * If defined, the `onParameterChangesApplied` callback is also called (after applying changes).
         *
         * Note: this method assumes the original and the copied sets contain parameters **in the same order**.
         *
         * @author Camille Gobert
         */
        applyParameterChanges() {
            for (let key in this.parametersToDisplay) {
                this.parametersToDisplay[key].value = this.parametersToDisplayCopy[key].value;
            }
            if (this.onParameterChangesApplied) {
                this.onParameterChangesApplied(this, this.parametersToDisplay, this.parametersToDisplayCopy);
            }
        }
        /**
         * Callback function called when the cancel button is clicked.
         * It cancels the parameter changes and closes the popup.
         *
         * @author Camille Gobert
         */
        onCancelButtonClick() {
            this.close();
        }
        /**
         * Callback function called when the ok button is clicked.
         * It applies the parameter changes and closes the popup.
         *
         * @author Camille Gobert
         */
        onOkButtonClick() {
            this.applyParameterChanges();
            this.close();
        }
        /**
         * Start handling popup events (e.g. clicks on the close button).
         *
         * @author Camille Gobert
         */
        startHandlingEvents() {
            super.startHandlingEvents();
            if (this.parameters.displayCancelButton) {
                this.app.eventManager.registerEventHandler(this.cancelButtonClickHandler);
            }
            if (this.parameters.displayOkButton) {
                this.app.eventManager.registerEventHandler(this.okButtonClickHandler);
            }
        }
        /**
         * Stop handling popup events (e.g. clicks on the close button).
         *
         * @author Camille Gobert
         */
        stopHandlingEvents() {
            super.stopHandlingEvents();
            if (this.parameters.displayCancelButton) {
                this.app.eventManager.unregisterEventHandler(this.cancelButtonClickHandler);
            }
            if (this.parameters.displayOkButton) {
                this.app.eventManager.unregisterEventHandler(this.okButtonClickHandler);
            }
        }
    }
    exports.ParametersFieldPopup = ParametersFieldPopup;
});
