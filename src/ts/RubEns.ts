import { RubEnsParameters } from "./RubEnsParameters";
import { Document } from "./Document";
import { DocumentParameters } from "./DocumentParameters";
import { EventManager } from "./UI/EventManager";
import { SupportChecker } from "./SupportChecker";

export class RubEns {
    static version: string = "0.1";

    readonly parameters: RubEnsParameters;

    // Currently modified document
    /*private*/ document: Document = null;

    private eventManager: EventManager;

    constructor (parameters: RubEnsParameters) {

        // Check the support of the used API
        let APISupported = SupportChecker.checkSupport();

        // TODO change error message
        if(!APISupported) {
            alert("RubEns is not supported on this browser");
        }

        this.eventManager = new EventManager();

        if (parameters.createDocumentOnStartup) {
            this.createDocument(new DocumentParameters());
        }

        // Start handling events in the UI
        this.eventManager.startListening();

        // Debug tests
        this.eventManager.registerEventHandler({
            eventTypes: ["click"],
            selector: "canvas",
            callback: (_) => console.log("Click event on canvas.")
        });

        this.eventManager.registerEventHandler({
            eventTypes: ["mousemove"],
            selector: "canvas",
            callback: (_) => console.log("Move event on canvas.")
        });
    }

    createDocument (parameters: DocumentParameters) {
        this.document = new Document(parameters, this.eventManager);
    }

    loadDocument (document: Document) {
        this.document = document;
    }
}
