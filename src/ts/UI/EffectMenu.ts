import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { Effect } from "../Effects/Effect";
import { RubEns } from "../RubEns";
import { ParametersFieldPopup, ParametersFieldPopupParameters } from "./ParametersFieldPopup";


/**
 * UI element representing the effect menu.
 *
 * It displays a list of effect buttons, whose effects are defined elsewhere,
 * which can be applied on click.
 */
export class EffectMenu extends HTMLRenderer {
    protected rootNodeId   = "effect_menu";
    protected rootNodeType = "ul";

    /**
     * Related app intance.
     */
    private app: RubEns;

    /**
     * Set of effects, to display in the UI.
     */
    private effects: Effect[];

    /**
     * Event handler callback meant to be called when a click occurs on an effect.
     */
    private effectClickEventHandler = {
        eventTypes: ["click"],
        selector: ".effect_button",
        callback: (event) => this.onEffectClick(event)
    };

    /**
     * Instanciates and initializes a new EffectMenu object.
     * @param  {JQuery}            parentNode Parent node owning current instance.
     * @param  {RubEns}            app        Related app intance.
     * @return {EffectMenu}                   Fresh instance of EffectMenu.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, app: RubEns) {
        super(parentNode);

        this.effects = [];
        this.app     = app;

        this.createRootNode();
        this.updateRootNode();

        this.app.eventManager.registerEventHandler(this.effectClickEventHandler);

        this.app.eventManager.registerEventHandler({
            eventTypes: ["rubens_documentCreated"],
            callback  : (event: CustomEvent) => {
                $(".effect_button").prop("disabled", false);
            }
        });
        this.app.eventManager.registerEventHandler({
            eventTypes: ["rubens_documentClosed"],
            callback  : (event: CustomEvent) => {
                $(".effect_button").prop("disabled", true);
            }
        });
    }

    /**
     * Empty the root node, and create and append an effect node for each effect.
     *
     * @author Camille Gobert
     */
    updateRootNode () {
        this.rootNode.empty();

        for (let effect of this.effects) {
            let effectNode = EffectMenu.createEffectNode(effect);
            this.rootNode.append(effectNode);
        }
    }

    /**
     * Update the list of effects, and update the root node afterwards.
     * @param  {Effect[]} effects List of [[Effect]] instances.
     *
     * @author Camille Gobert
     */
    setEffects (effects: Effect[]) {
        this.effects = effects;
        this.updateRootNode();
    }

    /**
     * Static method for creating an effect node, i.e. a node representing an effect in the UI,
     * able to respond to a click by applying the related effect, openning a popup to let the user
     * set the effect parameters if required.
     *
     * Note that this method assumes every effect has a different class (name),
     * as it uses it to identify every effect button in the UI..
     * @param  {Effect} effect Effect to represent with an effect node.
     * @return {JQuery}        Fresh effect node.
     *
     * @author Camille Gobert
     */
    private static createEffectNode (effect: Effect) {
        let effectName      = effect.name;
        let effectClassName = effect.constructor.name;

        let effectButton = $("<button>");
        effectButton.html(effectName);
        effectButton.attr("type", "button");
        effectButton.attr("data-effect-classname", effectClassName);
        effectButton.attr("title", effectName);
        effectButton.addClass("effect_button");

        // An effect is initially disabled
        effectButton.prop("disabled", true);

        let effectNode = $("<li>");
        effectNode.append(effectButton);

        return effectNode;
    }

    /**
     * Method which must be called when a click occurs on an effect node.
     * @param {Event} event Related click event.
     *
     * @author Camille Gobert
     */
    private onEffectClick (event: Event) {
        // Get the clicked effect instance
        let effectClassName = $(event.target).attr("data-effect-classname");

        let effect = this.effects.find((t) => t.constructor.name === effectClassName);
        if (! effect) {
            console.log("Error: effect " + effectClassName + " could not be loaded.");
            return;
        }

        // If there is no effect parameter, immetiately apply it
        let effectParameters = effect.parameters;
        if (Object.keys(effectParameters).length === 0) {
            effect.apply();
            return;
        }

        // Otherwise, open a popup to allow the user to configure the effect parameters,
        // before applying it (or cancelling)
        let parametersToDisplay = Object.keys(effectParameters)
                                        .map(key => { return effectParameters[key] });

        let popupParameters = new ParametersFieldPopupParameters();
        let popup = new ParametersFieldPopup(this.rootNode, this.app, popupParameters,
                                             parametersToDisplay, "New document");
        popup.onParameterChangesApplied = _ => {
            effect.apply();
        };

        popup.show();
    }
}
