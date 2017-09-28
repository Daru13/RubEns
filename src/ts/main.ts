import { RubEns } from "./RubEns";
import { RubEnsParameters } from "./RubEnsParameters";

// Global variable to hold the running instance of the app (for debug purposes)
let rubens = null;

document.addEventListener("DOMContentLoaded", function () {
    // Create a basic app (global for debug purposes)
    rubens = new RubEns(new RubEnsParameters());

    // Bind the single image to the canvas
    let canvas = document.getElementById("main_drawing_canvas");
    rubens.document.createImage(canvas);
}, false);
