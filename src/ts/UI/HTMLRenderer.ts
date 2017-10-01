import * as $ from "jquery";

export class HTMLRenderer {
    protected parentNode: JQuery;

    protected rootNode: JQuery;
    protected rootNodeId = "html_renderer";

    constructor (parentNode: JQuery) {
        this.parentNode = parentNode;
    }

    createRootNode () {
        this.rootNode = $("<div>");
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
