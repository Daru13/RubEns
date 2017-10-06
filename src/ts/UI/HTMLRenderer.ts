import * as $ from "jquery";

export class HTMLRenderer {
    protected parentNode: JQuery;

    protected rootNode: JQuery;
    protected rootNodeType = "div";
    protected rootNodeId   = "html_renderer";

    constructor (parentNode: JQuery) {
        this.parentNode = parentNode;
    }

    createRootNode () {
        this.rootNode = $("<" + this.rootNodeType + ">");
        this.rootNode.attr("id", this.rootNodeId);

        this.parentNode.append(this.rootNode);
    }

    updateRootNode () {

    }

    removeRootNode () {
        this.rootNode.remove();
        this.rootNode = null;
    }
}
