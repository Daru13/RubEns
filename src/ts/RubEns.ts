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


export class RubEns {
    static version: string = "0.1";

    readonly parameters: RubEnsParameters;

    // Currently modified document
    /*private*/ document: Document = null;

    private eventManager: EventManager;
    private rootLayout: RootLayout;

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
                e.preventDefault();
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
            "LineTool": new LineTool(this.document.drawingCanvas, this.document.workingCanvas),
            "EllipseTool": new EllipseTool(this.document.drawingCanvas, this.document.workingCanvas),
            "RectangleTool": new RectangleTool(this.document.drawingCanvas, this.document.workingCanvas),
            "FreeHandTool": new FreeHandTool(this.document.drawingCanvas, this.document.workingCanvas)
        })
    }

    createDocument (parameters: DocumentParameters) {
        this.document = new Document(parameters, this.eventManager);
    }

    loadDocument (document: Document) {
        this.document = document;
    }
}
