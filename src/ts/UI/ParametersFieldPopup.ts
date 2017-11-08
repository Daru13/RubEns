import * as $ from "jquery";
import { RubEns } from "../RubEns";
import * as Params from "../Parameter";
import { Popup, PopupParameters } from "./Popup";
import { ParametersField } from "./ParametersField";

/**
 * Set of parameters used by [[ParametersFieldPopup]].
 * Default values of those parameters are defined in the class implementation.
 */
 export class ParametersFieldPopupParameters extends PopupParameters {

     /**
      * By default, hide the standard close button.
      *
      * Closing the popup should be done by accepting or rejecting the changes,
      * using one of the two dedicated buttons (resp. ok and cancel)
      */
     displayCloseButton = false;

     /**
      * If set to `true`, display a cancel button on the popup.
      */
     displayCancelButton: boolean = true;

     /**
      * If set to `true`, display a ok button on the popup.
      */
     displayOkButton: boolean = true;
 }


/**
 * Specific UI element representing a popup containing a field of parameters.
 * It may also contain additional controls and a message.
 *
 * The given parameters (so-called *parameters to display*) are **internally copied**,
 * so that **the field of parameter only manipulates a copy**.
 * This allows easy cancelation of the parameter changes (e.g. if the user clicks the cancel button);
 * and the actual parameters are only modified by replacing their values upon validation (e.g. if the user clicks the ok button).
 */
export class ParametersFieldPopup extends Popup {
    protected rootNodeClasses = super.rootNodeClasses + " param_field_popup";

    /**
     * Instance of the popup parameters field.
     */
    protected parametersField: ParametersField;

    /**
     * Message to display before the parameters.
     */
    readonly message: string;

    /**
     * Reference to the message node of the popup.
     */
    protected messageNode: JQuery;

    /**
     * Set of parameters to display in the parameter field of the popup.
     */
    protected parametersToDisplay: Iterable<Params.Parameter<any>>;

    /**
     * Internal copy of the set of parameters to display.
     */
    protected parametersToDisplayCopy: Iterable<Params.Parameter<any>>;

    /**
     * Reference to the control wrapper node of the popup.
     */
    protected controlWrapperNode: JQuery;

    /**
     * Reference to the cancel button of the popup.
     */
    protected cancelButtonNode: JQuery;

    /**
     * Reference to the OK button of the popup.
     */
    protected okButtonNode: JQuery;

    /**
     * Parameters of the popup.
     */
    protected parameters: ParametersFieldPopupParameters;

    /**
     * Callback function called before the parameter changes are applied.
     * It receives the related popup, the initial and the modified parameters as argument.
     *
     * See [[applyParameterChanges]] and the class documentation for more details.
     */
    onParameterChangesApplied: (popup: Popup,
                                initialParameters: Iterable<Params.Parameter<any>>,
                                modifiedParameters: Iterable<Params.Parameter<any>>) => void;

    /**
     * Event handler for a click on the cancel button.
     */
    protected cancelButtonClickHandler = {
        eventTypes: ["click"],
        selector  : ".popup_cancel_button",
        callback  : (_) => { this.onCancelButtonClick(); }
    };

    /**
     * Event handler for a click on the OK button.
     */
    protected okButtonClickHandler = {
        eventTypes: ["click"],
        selector  : ".popup_ok_button",
        callback  : (_) => { this.onOkButtonClick(); }
    };


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
    constructor (parentNode: JQuery,
                app: RubEns,
                parameters: ParametersFieldPopupParameters,
                parametersToDisplay: Iterable<Params.Parameter<any>>,
                title?: string,
                message?: string) {
        super(parentNode, app, parameters, title);

        this.parametersToDisplay = parametersToDisplay;
        this.message             = message;

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
    protected createContentNode () {
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
    protected createParameterField () {
        // Note: this kinda ugly technique appears to possibly be the fastest easy/generic way
        // (i.e. https://stackoverflow.com/a/5344074)
        let parametersToDisplayCopy  = JSON.parse(JSON.stringify(this.parametersToDisplay));
        this.parametersToDisplayCopy = parametersToDisplayCopy;

        this.parametersField = new ParametersField(this.contentNode, this.app);
        this.parametersField.addAllParameters(parametersToDisplayCopy);
    }


    /**
     * Create and initialize the message node.
     * It simply wraps the message in a paragraph.
     *
     * @author Camille Gobert
     */
    protected createMessageNode () {
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
    protected createControlWrapper () {
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
    protected createCancelButton () {
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
    protected createOkButton () {
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
     *
     * Note: this method assumes the original and the copied sets contain parameters **in the same order**.
     * TODO: ensure this and avoid this trick!
     *
     * If defined, the `onParameterChangesApplied` callback is also called (after applying changes).
     *
     * @author Camille Gobert
     */
    protected applyParameterChanges () {
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
    private onCancelButtonClick () {
        this.close();
    }


    /**
     * Callback function called when the ok button is clicked.
     * It applies the parameter changes and closes the popup.
     *
     * @author Camille Gobert
     */
    private onOkButtonClick () {
        this.applyParameterChanges();
        this.close();
    }


    /**
     * Start handling popup events (e.g. clicks on the close button).
     *
     * @author Camille Gobert
     */
    protected startHandlingEvents () {
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
    protected stopHandlingEvents () {
        super.stopHandlingEvents();

        if (this.parameters.displayCancelButton) {
            this.app.eventManager.unregisterEventHandler(this.cancelButtonClickHandler);
        }

        if (this.parameters.displayOkButton) {
            this.app.eventManager.unregisterEventHandler(this.okButtonClickHandler);
        }
    }
}
