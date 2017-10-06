import * as $ from "jquery";
import { MainMenu } from "./MainMenu";
import { DrawingDisplay } from "./DrawingDisplay";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { HTMLRenderer } from "./HTMLRenderer";

/**
 * This class represents the root of the UI, which instanciates and communicate
 * each sub-module of the UI.
 */
export class RootLayout extends HTMLRenderer {
    // Sub-modules of the UI
    private mainMenu: MainMenu;
    private drawingDisplay: DrawingDisplay;
    private sidebar: Sidebar;
    private statusBar: StatusBar;

    protected rootNodeId = "root_layout";

    /**
     * Instanciates a new RootLayout, and initializes the sub-modules
     * @param parentNode  Parent HTML node where to set up the UI.
     *
     * @author Camille Gobert
     */
    constructor (parentNode: JQuery) {
        super(parentNode);
        this.createRootNode();

        this.mainMenu       = new MainMenu(this.rootNode);
        this.drawingDisplay = new DrawingDisplay(this.rootNode);
        this.sidebar        = new Sidebar(this.rootNode);
        this.statusBar      = new StatusBar(this.rootNode);
    }
}
