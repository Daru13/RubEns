import * as $ from "jquery";
import { HTMLRenderer } from "./HTMLRenderer";
import { ToolSelectionMenu } from "./ToolSelectionMenu";
import { Document } from "../Document";

export class MainMenu extends HTMLRenderer {
    protected rootNodeId = "main_menu";

    toolSelectionMenu: ToolSelectionMenu;

    constructor (parentNode: JQuery, document: Document) {
        super(parentNode);
        this.createRootNode();

        this.toolSelectionMenu = new ToolSelectionMenu(this.rootNode, document);
    }
}
