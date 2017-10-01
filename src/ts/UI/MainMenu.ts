import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";

export class MainMenu extends HTMLRenderer {
    protected rootNodeId = "main_menu";

    constructor (parentNode: JQuery) {
        super(parentNode);
        this.createRootNode();
        this.updateRootNode();
    }

    updateRootNode () {
        this.rootNode.html(this.rootNodeId);
    }

}
