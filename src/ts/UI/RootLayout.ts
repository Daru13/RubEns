import { MainMenu } from "./MainMenu";
import { DrawingDisplay } from "./DrawingDisplay";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { HTMLRenderer } from "./HTMLRenderer";
import { Document } from "../Document";

import { Popup, PopupParameters } from "./Popup";
import { ParametersFieldPopupParameters, ParametersFieldPopup } from "./ParametersFieldPopup";

/**
 * This class represents the root of the UI, which instanciates and communicate
 * each sub-module of the UI.
 */
export class RootLayout extends HTMLRenderer {
    // Sub-modules of the UI
    mainMenu: MainMenu;
    drawingDisplay: DrawingDisplay;
    sidebar: Sidebar;
    statusBar: StatusBar;

    protected rootNodeId = "root_layout";

    /**
     * Instanciates a new RootLayout, and initializes its sub-modules
     * @param parentNode  Parent HTML node where to set up the UI.
     * @param document    Rleated document instance.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, document: Document) {
        super(parentNode);
        this.createRootNode();

        this.mainMenu       = new MainMenu(this.rootNode, document);
        this.drawingDisplay = new DrawingDisplay(this.rootNode);
        this.sidebar        = new Sidebar(this.rootNode, document);
        this.statusBar      = new StatusBar(this.rootNode);

        // TODO: debug code, to be removed!
        /*
        let popupParams = new ParametersFieldPopupParameters();
        let paramsToDisplay = Object.keys(document.parameters.sharedToolParameters)
                                    .map((key) => document.parameters.sharedToolParameters[key])
        let popup = new ParametersFieldPopup(this.rootNode, document, popupParams,
                                             paramsToDisplay,
                                             "Look at this parameter popup!",
                                             "Try to edit those parameters...");
        popup.onParameterChangesApplied = () => {
            console.log("parameter changes applied");

            // Notify the UI global parameters have been updated
            let evt = new CustomEvent("rubens_globalparameterschanged", {bubbles: true});
            this.rootNode[0].dispatchEvent(evt);
        }

        popup.show();
        */
    }
}
