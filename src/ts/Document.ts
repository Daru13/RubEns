import { Image } from "./Image";
import { DocumentParameters } from "./DocumentParameters";

export class Document {
    // Single image per document
    // TODO: handle multiple images/layers?
    image: Image;

    readonly parameters: DocumentParameters;

    constructor (parameters: DocumentParameters, image?: Image) {
        this.parameters = parameters;
        this.image      = image;
    }
}
