define(["require", "exports", "./Parameter"], function (require, exports, Params) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DocumentParameters {
        constructor() {
            /**
             * Title of the document.
             */
            this.title = {
                value: "New document",
                kind: Params.ParameterKind.String,
                name: "Title",
                minLength: 1,
                maxLength: 32
            };
            /**
             * Dimensions of the document.
             */
            this.width = {
                value: 800,
                kind: Params.ParameterKind.Number,
                name: "Width",
                min: 1,
                max: 2048
            };
            this.height = {
                value: 600,
                kind: Params.ParameterKind.Number,
                name: "Height",
                min: 1,
                max: 2048
            };
            /**
             * Global parameters, shared by all tools (but still local to the document).
             */
            this.sharedToolParameters = {
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
    }
    exports.DocumentParameters = DocumentParameters;
});
