import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { Document } from "../Document";
import { RubEns } from "../RubEns";


/**
 * Interface which must be implemented by any document action
 * to be appended and displayed in this menu.
 */
export interface DocumentAction {
    /**
     * The name of the action, displayed in the UI.
     * It must be unique for each action, as it is used to identify it when triggered in the UI!
     */
    name: string;

    /**
     * Function to apply the action to a given document.
     * @param {Document} document The targeted document.
     */
    apply: (document: Document) => void;

    /**
     * State of the action; if defined and set to true, the action is considered disabled.
     * A disabled action may be visible in the UI, but should not be triggered by the user.
     */
    disabled?: boolean;
}


/**
 * UI element representing the document actions menu.
 *
 * It manages a list of actions operating on the current document,
 * meant to represent procedures like saving or creating a document.
 */
export class DocumentActionsMenu extends HTMLRenderer {
    protected rootNodeId   = "document_actions_menu";
    protected rootNodeType = "ul";

    /**
     * Set of document actions, to display in the UI.
     */
    private actions: DocumentAction[];

    /**
     * Related app intance.
     */
    private app: RubEns;

    /**
     * Event handler callback meant to be called when a click occurs on a tool.
     */
    private actionClickEventHandler = {
        eventTypes: ["click"],
        selector: ".document_action_button",
        callback: (event) => this.onDocumentActionClick(event)
    };

    /**
     * Instanciates and initializes a new DocumentActionsMenu object,
     * and set up the related click event handler.
     * @param  {JQuery}              parentNode Parent node owning current instance.
     * @param  {RubEns}              app        Related app intance.
     * @return {DocumentActionsMenu}            Fresh instance of DocumentActionsMenu.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, app: RubEns) {
        super(parentNode);

        this.actions = [];
        this.app     = app;

        this.createRootNode();
        this.updateRootNode();

        this.app.eventManager.registerEventHandler(this.actionClickEventHandler);

        // TODO: temporary, improve and move elsewhere!
        this.app.eventManager.registerEventHandler({
            eventTypes: ["rubens_documentCreated", "rubens_documentClosed"],
            selector: $(document),
            callback: (_) => {
                let actionstoDisable = this.actions.filter((action) => {
                    return /*action.name === "Import image" ||*/ action.name === "Export image";
                });

                for (let action of actionstoDisable) {
                    action.disabled = ! this.app.document;
                }

                this.updateRootNode();
            }
        })
    }

    /**
     * Empty the root node, and create and append a action node for each known action.
     *
     * @author Camille Gobert
     */
    updateRootNode () {
        this.rootNode.empty();

        for (let action of this.actions) {
            let actionNode = DocumentActionsMenu.createActionNode(action);
            this.rootNode.append(actionNode);
        }
    }

    /**
     * Update the list of known actions, and update the root node afterwards.
     * @param  {DocumentAction[]} actions List of [[DocumentAction]] instances.
     *
     * @author Camille Gobert
     */
    setActions (actions: DocumentAction[]) {
        this.actions = actions;
        this.updateRootNode();
    }

    /**
     * Static method for creating an action node, i.e. a node representing a document action in the UI,
     * able to respond to a click by applying the action to the current document.
     *
     * Note that this method assumes every action has a different name,
     * as it uses it to identify every single document action button in the UI.
     * @param  {DocumentAction} action  Document action to represent with a action node.
     * @return {JQuery}                 Fresh action node.
     *
     * @author Camille Gobert
     */
    private static createActionNode (action: DocumentAction) {
        let actionName = action.name;

        let actionButton = $("<button>");
        actionButton.html(actionName);
        actionButton.attr("type", "button");
        actionButton.attr("data-doc-action-name", actionName);
        actionButton.addClass("document_action_button");

        if (action.disabled) {
            actionButton.prop("disabled", true);
        }

        let actionNode = $("<li>");
        actionNode.append(actionButton);

        return actionNode;
    }

    /**
     * Method which must be called when a click occurs on an action node.
     * @param  {Event}  event Related click event.
     *
     * @author Camille Gobert
     */
    onDocumentActionClick (event: Event) {
        // Get the clicked document action instance
        let documentActionName = $(event.target).attr("data-doc-action-name");

        let action = this.actions.find((dA) => dA.name === documentActionName);
        if (! action) {
            console.log("Error: action " + documentActionName + " could not be found.");
            return;
        }

        // Apply the right action
        action.apply(this.app.document);
    }
}
