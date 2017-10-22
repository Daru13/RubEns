import { RubEnsParameters } from "./RubEnsParameters";
import { Document } from "./Document";
import { DocumentParameters } from "./DocumentParameters";
import { EventManager } from "./UI/EventManager";
import { SupportChecker } from "./SupportChecker";
import { RootLayout } from "./UI/RootLayout";

import { Tool } from "./Tools/Tool";
import { LineTool } from "./Tools/LineTool";
import { EllipseTool } from "./Tools/EllipseTool";
import { RectangleTool } from "./Tools/RectangleTool";
import { FreeHandTool } from "./Tools/FreeHandTool";
import {RectangleSelectionTool} from "./Tools/RectangleSelectionTool";


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
     * List of all available [[Tool]] instances.
     */
    private tools: Tool[];

    /**
     * Instanciates and initializes a new RubEns object.
     *
     * This method calls various intiialization functions defined in this class,
     * in order to setup various parts of the app (e.g. tools, UI, document).
     * @param  {RubEnsParameters} parameters Set of parameters to use.
     * @return {RubEns}                      Fresh instance of RubEns.
     *
     * @author Camille Gobert
     */
    constructor (parameters: RubEnsParameters) {
        this.checkAPISupport();

        this.parameters = parameters;

        this.initEventManager();
        this.initTools();
        this.initDocument();
        this.initUserInterface();

        // TODO: move this elsewhere!
        this.document.createCanvases();
    }


    /**
     * Perform various checks to detect if all required features are avilable or not.
     *
     * @author Camille Gobert
     */
    checkAPISupport () {
        // TODO: change error message
        let APISupported = SupportChecker.checkSupport();
        if (! APISupported) {
            alert("RubEns is not fully supported on this browser");
        }
    }


    /**
     * Create and set up the event manager, which starts listening for events.
     *
     * @author Camille Gobert
     */
    initEventManager () {
        // Start handling events in the UI
        this.eventManager = new EventManager();
        this.eventManager.startListening();

        // Debug code
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
    }


    /**
     * Initialize the list of available tools.
     * This method should save an instance of every exposed [[Tool]] object.
     *
     * @author Camille Gobert
     */
    initTools () {
        this.tools = [
            new LineTool(),
            new EllipseTool(),
            new RectangleTool(),
            new FreeHandTool(),
            new RectangleSelectionTool()
        ];
    }


    /**
     * Initialize the user interface.
     * Note that this method requires tools and document to already exist!
     *
     * @author Camille Gobert
     */
    initUserInterface () {
        this.rootLayout = new RootLayout($("body"), this.document);

        this.rootLayout.mainMenu.toolSelectionMenu.setTools(this.tools);
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

    /**
     *
     * Initialize the current document the right way.
     *
     * @author Camille Gobert
     */
    initDocument () {
        if (this.parameters.createDocumentOnStartup) {
            this.createDocument(new DocumentParameters());
        }
    }
}
