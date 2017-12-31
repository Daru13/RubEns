import { HTMLRenderer } from "./HTMLRenderer";
import { DocumentActionsMenu } from "./DocumentActionsMenu";
import { RubEns } from "../RubEns";
import { DocumentParameters } from "../DocumentParameters";
import { ParametersFieldPopup, ParametersFieldPopupParameters } from "./ParametersFieldPopup";
import { ImageLoader } from "../utils/ImageLoader";


/**
* Main UI element representing the top main menu of the UI.
*
* It is meant to display general and important controls to the user,
* such as actions concerning the whole document (creation, closing, export, etc).
*/
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
     * Reference to the node containing the app title.
     */
    titleNode: JQuery;

    /**
     * Instanciates and initializes a new MainMenu object, and set up the underlying controls.
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
    setDefaultDocumentActions () { // TODO: move this elsewhere, e.g. in the action menu
        let defaultActions = [];

        defaultActions.push({
            name: "New",
            apply: (document) => {
                let newDocumentParameters = new DocumentParameters();
                let parametersToDisplay = [
                    newDocumentParameters.title,
                    newDocumentParameters.width,
                    newDocumentParameters.height
                ];

                let popupParameters = new ParametersFieldPopupParameters();
                let popup = new ParametersFieldPopup(this.rootNode, this.app, popupParameters,
                                                     parametersToDisplay, "New document");
                popup.onParameterChangesApplied = (_) => { this.app.createEmptyDocument(newDocumentParameters); };

                popup.show();
            },
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
            apply: (document) => {
              if (document) {
                document.importImage();
              }
              else {
                console.log("init loading");
                ImageLoader.load((image) => {
                    console.log("load callback");
                    this.app.createDocumentFromImage(image, new DocumentParameters());
                });
              }
            },
            disabled: false
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
