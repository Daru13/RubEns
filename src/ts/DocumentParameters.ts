import * as Params from "./Parameter";

export class DocumentParameters {
    /**
     * Title of the document.
     */
    title: string = "New document";

    /**
     * Dimensions of the document.
     */
    width: number  = 800;
    height: number = 600;

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
