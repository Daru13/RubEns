import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";

export class Sidebar extends HTMLRenderer {
    protected rootNodeId = "sidebar";

    constructor (parentNode: JQuery) {
        super(parentNode);
        this.createRootNode();
        this.updateRootNode();
    }

    updateRootNode () {
        this.rootNode.html(this.rootNodeId);
    }
}
