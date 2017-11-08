import { HTMLRenderer } from "./HTMLRenderer";
import { ToolSelectionMenu } from "./ToolSelectionMenu";
import { DocumentActionsMenu } from "./DocumentActionsMenu";
import { RubEns } from "../RubEns";

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
     * Related app intance.
     */
    private app: RubEns;

    /**
     * Instance of the child tool document actions menu.
     */
    documentActionsMenu: DocumentActionsMenu;

    /**
     * Instance of the child tool selection menu.
     */
    toolSelectionMenu: ToolSelectionMenu;

    /**
     * Reference to the node containing the app title.
     */
    titleNode: JQuery;

    /**
     * Instanciates and initializes a new MainMenu object and its sub-modules.
     * @param  {JQuery}   parentNode Parent node owning current instance.
     * @param  {RubEns}   app        Related app instance.
     * @return {MainMenu}            Fresh instance of MainMenu.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, app: RubEns) {
        super(parentNode);
        this.createRootNode();

        this.app = app;

        this.documentActionsMenu = new DocumentActionsMenu(this.rootNode, app);
        this.toolSelectionMenu   = new ToolSelectionMenu(this.rootNode, app);
        this.createTitleNode();

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
            apply: (document) => { this.app.createDocument(); },
            disabled: false
        });

        defaultActions.push({
            name: "Close",
            apply: (document) => { this.app.closeDocument(); },
            disabled: false
        });

        /*
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
        */

        // Importing an image in the current document
        defaultActions.push({
            name: "Import image",
            apply: (document) => { document.importImage(); },
            disabled: true
        });

        // Exporting current document as an image
        defaultActions.push({
            name: "Export image",
            apply: (document) => { document.exportImage(); },
            disabled: true
        });

        this.documentActionsMenu.setActions(defaultActions);
    }


    /**
     * Create and set up a title node, and prepends it to the main menu.
     * It simply contains the title of the application, `RubEns`.
     *
     * @author Camille Gobert
     */
    private createTitleNode () {
        let title = $("<h1>");
        title.html("RubEns");
        // title.attr("id", "app_title");

        this.titleNode = $("<a>");
        this.titleNode.attr("id", "app_title");
        this.titleNode.attr("href", "https://github.com/Daru13/RubEns");
        this.titleNode.attr("target", "blank");

        this.titleNode.append(title);
        this.rootNode.prepend(this.titleNode);
    }
}
