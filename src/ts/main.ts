import { RubEns } from "./RubEns";
import { RubEnsParameters } from "./RubEnsParameters";

// Create a basic app (global for debug purposes)
let parameters = new RubEnsParameters();
parameters.createDocumentOnStartup = false;

document["rubens"] = new RubEns(parameters);
