import { RubEnsParameters } from "./RubEnsParameters";
import { Document } from "./Document";
import { DocumentParameters } from "./DocumentParameters";
import { EventManager } from "./UI/EventManager";
import { SupportChecker } from "./SupportChecker";
import { RootLayout } from "./UI/RootLayout";

import { LineTool } from "./DrawingTools/LineTool";
import { EllipseTool } from "./DrawingTools/EllipseTool";
import { RectangleTool } from "./DrawingTools/RectangleTool";
import { FreeHandTool } from "./DrawingTools/FreeHandTool";


/**
 * Most general class of the project, representing the whole application.
 *
 * It manages and bonds components shared by various parts of the app,
 * such as documents, UI elements, the event manager.
 */
export class RubEns {
    /**
     * Version of the application.
     */
    static version: string = "0.1";

    /**
     * Application-level parameters.
     */
    readonly parameters: RubEnsParameters;

    /**
     * Currently loaded document.
     */
    /*private*/ document: Document = null;

    /**
     * Event manager of the application.
     */
    private eventManager: EventManager;

    /**
     * Top-level UI element.
     */
    private rootLayout: RootLayout;

    /**
     * Instanciates and initializes a new RubEns object.
     * It check the support of various APIs, start the event manager, setup tools and the UI.
     * @param  {RubEnsParameters} parameters Set of parameters to use.
     * @return {RubEns}                      Fresh instance of RubEns.
     *
     * @author Camille Gobert
     */
    constructor (parameters: RubEnsParameters) {

        // Check the support of the used API
        // TODO: change error message
        let APISupported = SupportChecker.checkSupport();
        if (! APISupported) {
            alert("RubEns is not supported on this browser");
        }

        // Start handling events in the UI
        this.eventManager = new EventManager();
        this.eventManager.startListening();

        // Debug tests
        this.eventManager.registerEventHandler({
            eventTypes: ["keypress"],
            selector: "html",
            callback: (e) => {
                // TODO: prevent default behaviour without blocking  
                // e.preventDefault();
                let ev = <KeyboardEvent> e;

                if (ev.ctrlKey && ev.key.toLowerCase() == "e") {
                    this.document.exportImage();
                }
                if (ev.ctrlKey && ev.key.toLowerCase() == "i") {
                    this.document.importImage();
                }
            }
        });

        if (parameters.createDocumentOnStartup) {
            this.createDocument(new DocumentParameters());
        }

        // Initiate the UI
        // TODO: do it in a much better way!
        this.rootLayout = new RootLayout($("body"), this.document);

        this.document.createCanvases();

        this.rootLayout.mainMenu.toolSelectionMenu.setTools({
            "LineTool": new LineTool(this.document.imageWorkspace),
            "EllipseTool": new EllipseTool(this.document.imageWorkspace),
            "RectangleTool": new RectangleTool(this.document.imageWorkspace),
            "FreeHandTool": new FreeHandTool(this.document.imageWorkspace)
        })
    }

    /**
     * Create a new document, set as the current one.
     * @param  {DocumentParameters} parameters Set of document parameters.
     *
     * @author Camille Gobert
     */
    createDocument (parameters: DocumentParameters) {
        this.document = new Document(parameters, this.eventManager);
    }

    // TODO
    loadDocument (document: Document) {
        this.document = document;
    }
}
