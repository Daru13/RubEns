import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { ToolSelectionMenu } from "./ToolSelectionMenu";
import { DocumentAction, DocumentActionsMenu } from "./DocumentActionsMenu";
import { Document } from "../Document";

/**
* Main UI element representing the top main menu of the UI.
*
* It is meant to display importants actions and tools to the user,
* organised in a meaningful way, so that the latter can easily interact
* with the document by the mean of controls presented in this menu.
* */
export class MainMenu extends HTMLRenderer {
    protected rootNodeId = "main_menu";

    /**
     * Instance of the child tool document actions menu.
     */
    documentActionsMenu: DocumentActionsMenu;

    /**
     * Instance of the child tool selection menu.
     */
    toolSelectionMenu: ToolSelectionMenu;

    /**
     * Instanciates and initializes a new MainMenu object and its sub-modules.
     * @param  {JQuery}   parentNode Parent node owning current instance.
     * @param  {Document} document   Related document instance.
     * @return {MainMenu}            Fresh instance of MainMenu.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document) {
        super(parentNode);
        this.createRootNode();

        this.documentActionsMenu = new DocumentActionsMenu(this.rootNode, document);
        this.toolSelectionMenu   = new ToolSelectionMenu(this.rootNode, document);

        this.setDefaultDocumentActions();
    }

    /**
     * Set a list of default document actions in the related child menu (and update it).
     *
     * This method may lay here for as long as document actions should not be handled
     * by the model, or by another more-purposed class.
     *
     * @author Camille Gobert
     */
    setDefaultDocumentActions () {
        let defaultActions = [];

        // TODO: implement new document, saving and loading actions!
        defaultActions.push({
            name: "New",
            apply: (document) => {  },
            disabled: true
        });

        defaultActions.push({
            name: "Save",
            apply: (document) => {  },
            disabled: true
        });

        defaultActions.push({
            name: "Load",
            apply: (document) => {  },
            disabled: true
        });


        // Importing an image in the current document
        defaultActions.push({
            name: "Import image",
            apply: (document) => { document.importImage(); }
        });

        // Exporting current document as an image
        defaultActions.push({
            name: "Export image",
            apply: (document) => { document.exportImage(); }
        });

        this.documentActionsMenu.setActions(defaultActions);
    }
}
