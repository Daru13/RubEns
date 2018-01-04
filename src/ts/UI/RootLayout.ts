import { MainMenu } from "./MainMenu";
import { DrawingDisplay } from "./DrawingDisplay";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { ToolMenu } from "./ToolMenu";
import { HTMLRenderer } from "./HTMLRenderer";
import { RubEns } from "../RubEns";

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
    toolMenu: ToolMenu;

    protected rootNodeId = "root_layout";

    /**
     * Instanciates a new RootLayout, and initializes its sub-modules
     * @param parentNode  Parent HTML node where to set up the UI.
     * @param app         Related app instance.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery, app: RubEns) {
        super(parentNode);
        this.createRootNode();

        this.mainMenu       = new MainMenu(this.rootNode, app);
        this.drawingDisplay = new DrawingDisplay(this.rootNode, app);
        this.sidebar        = new Sidebar(this.rootNode, app);
        this.statusBar      = new StatusBar(this.rootNode, app);
        this.toolMenu       = new ToolMenu(this.rootNode, app);

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
