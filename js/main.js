define(["require", "exports", "./RubEns", "./RubEnsParameters"], function (require, exports, RubEns_1, RubEnsParameters_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Create a basic app (global for debug purposes)
    let parameters = new RubEnsParameters_1.RubEnsParameters();
    parameters.createDocumentOnStartup = false;
    document["rubens"] = new RubEns_1.RubEns(parameters);
});
