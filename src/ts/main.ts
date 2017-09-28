import { RubEns } from "./RubEns";
import { RubEnsParameters } from "./RubEnsParameters";

// Global variable to hold the running instance of the app (for debug purposes)
document["rubens"] = null;
console.log(document["rubens"]);

// Create a basic app (global for debug purposes)
document["rubens"] = new RubEns(new RubEnsParameters());

// Bind the single image to the canvas
let canvas = document.getElementById("main_drawing_canvas");
document["rubens"].document.createImage(canvas);
