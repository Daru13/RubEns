import { RubEnsParameters } from "./RubEnsParameters";
import { Document } from "./Document";
import { DocumentParameters } from "./DocumentParameters";

export class RubEns {
    static version: string = "0.1";

    readonly parameters: RubEnsParameters;

    // Currently modified document
    private document: Document = null;

    constructor (parameters: RubEnsParameters) {
        if (parameters.createDocumentOnStartup) {
            this.createDocument(new DocumentParameters());
        }
    }

    createDocument (parameters: DocumentParameters) {
        this.document = new Document(parameters);
    }

    loadDocument (document: Document) {
        this.document = document;
    }
}
