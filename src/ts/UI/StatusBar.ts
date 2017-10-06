import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";

export class StatusBar extends HTMLRenderer {
    protected rootNodeId = "status_bar";

    constructor (parentNode: JQuery) {
        super(parentNode);
        this.createRootNode();
        this.updateRootNode();
    }

    updateRootNode () {
        this.rootNode.html(this.rootNodeId);
    }
}
