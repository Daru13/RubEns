import * as Params from "./Parameter";

export class DocumentParameters {
    /**
     * Title of the document.
     */
    title = {
        value: "New document",
        kind: Params.ParameterKind.String,
        name: "Title",
        pattern: /pint/i
    };

    /**
     * Dimensions of the document.
     */
    width = {
        value: 800,
        kind: Params.ParameterKind.Number,
        name: "Width",
        min: 1,
        max: 2048
    };

    height = {
        value: 600,
        kind: Params.ParameterKind.Number,
        name: "Height",
        min: 1,
        max: 2048
    };

    /**
     * Global parameters, shared by all tools (but still local to the document).
     */
    sharedToolParameters = {
        /**
         * Main color, i.e. filling color for various tools.
         */
        mainColor: {
            value: "#000000",
            kind: Params.ParameterKind.Color,
            name: "Main color"
        },

        secondaryColor: {
            value: "#FFFFFF",
            kind: Params.ParameterKind.Color,
            name: "Secondary color"
        }

    };
}
