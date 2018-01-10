import { Document } from "./Document";
import { EventManager } from "./EventManager";
import { EventHandler } from "./EventHandler";
import { Layer } from "./Image/Layer"
import { SelectedArea } from "./Image/SelectedArea"

/**
 * An function given to the history has one argument (the document) and returns nothing.
 */
type HistoryFunction = (document : Document) => void;

/**
 * This is the interface that every step send to the history should implement.
 */
export interface HistoryStep {
    /**
     * @param  {string} type A Key-word indicating the nature of the action.
     */
    type: string;
    /**
     * @param  {string} description A short description of the action.
     */
    description: string;
    /**
     * @param  {HistoryStep} redo   A function that reapplies the action.
     */
    redo: HistoryFunction;
    /**
     * @param  {HistoryStep} undo  A function that cancels the action.
     */
    undo: HistoryFunction;

}

export class GenericHistoryStep implements HistoryStep {
    type: string = "GenericHistoryStep";

    /**
     * A short description of tha action.
     */
    description: string;


    redo: HistoryFunction;
    undo: HistoryFunction;

    /**
     * Basic constructor
     * @param  {string}          description A short description of the action.
     * @param  {HistoryFunction} redo        A function that reapplies the action.
     * @param  {HistoryFunction} undo        A function that cancels the action.
     * @return {void}                      Returns nothing, works by side-effect.
     *
     * @author Josselin GIET
     */
    constructor(description: string, redo: HistoryFunction, undo: HistoryFunction){
        this.description = description;
        this.redo = redo;
        this.undo = undo;
    }
}

export class EditLayerStep implements HistoryStep {
    type: string = "EditLayerStep";

    /**
     * A short description of tha action.
     */
    description: string;


    /**
     * The ImageData before the action.
     */
    previousImageData: ImageData;

    /**
     * The ImageData after the action.
     */
    newImageData: ImageData;

    /**
     * the id of the current selectedLayer.
     */
    layerId: number;

    /**
     * basic constructor.
     * @param  {string}    description       A short description of the action.
     * @param  {ImageData} previousImageData The ImageData before the action.
     * @param  {ImageData} newImageData      The ImageData after the action.
     * @param  {number}    layerId           the id of the current selectedLayer.
     * @return {void}                      Returns nothing, works by side-effect.
     *
     * @author Josselin GIET
     */
    constructor(description: string, previousImageData: ImageData, newImageData: ImageData, layerId: number){
        this.description = description;
        this.previousImageData = previousImageData;
        this.newImageData = newImageData;
        this.layerId = layerId;
    }

    undo (document: Document) {
        // console.log(this.previousLayer);
        // console.log(this.previousLayer.canvas);
        document.imageWorkspace.drawingLayers.selectedLayer.canvas.setImageData(this.previousImageData);
        document.imageWorkspace.redrawDrawingLayers();
    }
    redo (document: Document) {
        document.imageWorkspace.drawingLayers.selectedLayer.canvas.setImageData(this.newImageData);
        document.imageWorkspace.redrawDrawingLayers();
    }
}

export class EditSelectionStep implements HistoryStep {
    type: string = "EditSelectionStep";
    description: string;
    previousSelection: SelectedArea;
    newSelection: SelectedArea;

    /**
     * basic constructor
     * @param  {string}       description       A short description of the action.
     * @param  {SelectedArea} previousSelection The selectedArea before the action.
     * @param  {SelectedArea} newSelection      The selectedArea after the action.
     * @return {void}                         Returns nothing, works by side-effect.
     *
     * @author Josselin GIET
     */
    constructor(description: string, previousSelection: SelectedArea, newSelection: SelectedArea){
        this.description = description;
        this.previousSelection = previousSelection;
        this.newSelection = newSelection;
    }

    undo(document){
        document.imageWorkspace.selectedArea = this.previousSelection;
    }
    redo(document){
        document.imageWorkspace.selectedArea = this.newSelection;
    }
}

//  More to come :
//  - Adding Layer
//  - Merging Layer
