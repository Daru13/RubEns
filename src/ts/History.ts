import { Document } from "./Document";
import { EventManager } from "./EventManager";
import { EventHandler } from "./EventHandler";

/**
 * An function given to the history has no rgument and returns nothing.
 */
type HistoryFunction = () => void;

/**
 * This interface describes an history's "step".
 */
export interface HistoryStep {
    /**
     * A short description of the step for the UI.
     * @type {string}
     */
    description: string;
    /**
     * the action to apply. Works only by side effect.
     * @type {HistoryFunction}
     */
    redo: HistoryFunction;
    /**
     *  a function that cancels the result of the redo`function.
     * @type {HistoryFunction}
     */
    undo?: HistoryFunction;
    /**
     * the image after the redo function is applied.
     * @type {HistoryFunction}
     */
    image?: ImageData;
    /**
     * the index of the step storring the nearest image in
     *          the following of the history.
     *          Equals -1 if this image doesn't exists.
     * @type {number}
     */
    nearestForwardImage: number;
    /**
     * the index of the step storring the nearest image in
     *          the steps before this one in the history.
     * @type {number}
     */
    nearestBackwardImage: number;
    /**
     * the number of actions on canvas since the latest
     *          image storred.
     * @type {number}
     */
    numberOfActionOnCanvas: number;
}



/**
 * This is a generic history for a single document.
 * It works as follow :
 * - each action is saved in a "HistoryStep" that contains the action
 * and sometimes, a function that cancels it.
 * - If the action affect Canvas (eg. draws a rectangele) we store the ImageData
 * of the corresponding Layer
 */
export class History {

    /**
     * The document whose history is registered.
     */
    document: Document;

    /**
     * The event manager used to dispatch events
     */
    eventManager: EventManager;


    /**
     * The list of the actions applied on the document and storred.
     */
    listOfActions: HistoryStep[] = [];

    /**
     * The first (i.e. in time) available step.
     * We cannot go later in the history.
     */
    firstAvailableStep: number = 0;

    /**
     * The latest available step. We cannot go further.
     */
    numberOfStep: number = 0;

    /**
     * The number of images storred in the current history.
     * Used in order to control the memory used.
     * This is the "head" of the history.
     */
    numberOfImages: number = 0;

    /**
     * The cuurent state of the image in the history.
     * It might be different from numberOfStep.
     * See the function goToStep.
     */
    currentStep: number = 0;

    /**
     * The upper bound of images thatcan be saved in the history.
     * If we reach this limit, we delete the latest saved image.
     */
    boundOnImages: number = 10;

    /**
     * The upper bound of actions on canvas (e.g. draw rectangle, line ...) that can be storred
     * between two images : When we reach this bound, we save another image.
     */
    boundOnCanvas: number = 10;

    /**
     * This EventHandler is called for basic operations.
     */
    handleApply: EventHandler = {
        eventTypes: ["rubens_historyApply"],
        callback : (event: CustomEvent) => {
            this.applied(event.detail.description, event.detail.redo, event.detail.undo)
        }
    }

    /**
     * This EventHandler should be called when you make an operation on canvas.
     */
    handleApplyOnCanvas: EventHandler = {
        eventTypes: ["rubens_historyApplyOnCanvas"],
        callback : (event: CustomEvent) => {
            this.appliedOnCanvas(event.detail.description, event.detail.redo, event.detail.undo)
        }
    }

    /**
     * The constructor that initializes the History
     * by adding an *empty* step with the image in the beginning.
     * @param  {Document} document Returns nothing : works by side-effect.
     * @return {[type]}            A reference to the document whose actions have to be storred.
     *
     * @author Josselin GIET
     */
    constructor(document: Document, eventManager: EventManager){
        this.document = document;
        this.listOfActions[0] = {
            // basically, this step is only useful since it contains an image.
            // the actios are "empty" functions.
            description: "Document initiation",
            redo: function () { null },
            undo: function () { null },
            image: this.document.imageWorkspace.drawingLayers.selectedLayer.canvas.getImageData(),
            nearestForwardImage: 0,
            nearestBackwardImage: 0,
            numberOfActionOnCanvas:0,
        }
        this.numberOfStep = 0;
        this.numberOfImages = 1;
        this.currentStep = 0;

        this.eventManager = eventManager;
        this.eventManager.registerEventHandler(this.handleApply);
        this.eventManager.registerEventHandler(this.handleApplyOnCanvas);
    }


    /**
     * This function delete the history between the current step and this.numberOfStep.
     * This function is called when we have to save a new step
     * but the curent step is not the head of the history.
     * @return {[void]} Returns nothing : works by side effect on the history.
     *
     * @author Josselin GIET
     */
    clearHead() {
        if (this.currentStep < this.numberOfStep) {
            // First, we delete the steps between the curent one and the head of the history.
            for (let i = this.currentStep+1; i <= this.numberOfStep; i++){
                delete this.listOfActions[i];
            }
            // Then, we correct the number of Step in the current step.
            this.numberOfStep = this.currentStep;
            // Finally, we put the nearestForwardImage of the "new" head of the history.
            for (let i = this.numberOfStep; i < this.listOfActions[this.currentStep].nearestBackwardImage; i++){
                this.listOfActions[i].nearestForwardImage = -1;
            }
        }
    }

    /**
     * This function stores the functions given in argument.
     * @param  {HistoryFunction} redo the function to save and apply.
     * @param  {HistoryFunction} undo the function that reverse the redo one.
     * @return {void} Returns nothing : works by side effect on the history.
     *
     * @author Josselin GIET
     */
    applied(description: string, redo: HistoryFunction, undo?: HistoryFunction){
        //First, we have to clear the head.
        this.clearHead();
        // Then, we increment the right indices.
        this.currentStep += 1;
        this.numberOfStep += 1;
        this.listOfActions[this.numberOfStep] =
            {description: description,
             redo: redo,
             undo: undo,
             image: null,
             nearestForwardImage: -1,
             nearestBackwardImage: this.listOfActions[this.numberOfStep-1].nearestBackwardImage,
             numberOfActionOnCanvas: this.listOfActions[this.numberOfStep-1].numberOfActionOnCanvas,
        }
    }



    /**
     * This function stores the functions given in argument and calls this function,
     * and increases numberOfActionOnCanvas.
     * @param  {HistoryFunction} redo the function to apply.
     * @param  {HistoryFunction} undo the inverse function of undo.
     * @return {void} Returns nothing : works by side-effect.
     *
     * @author Josselin GIET
     */
    appliedOnCanvas(description: string, redo: HistoryFunction, undo?: HistoryFunction){
        //First, we have to clear the head.
        this.clearHead();
        // Then, we increment the right indices.
        this.currentStep += 1;
        this.numberOfStep += 1;
        this.listOfActions[this.numberOfStep] = {
            description: description,
            redo: redo,
            undo: undo,
            image: this.document.imageWorkspace.drawingLayers.selectedLayer.canvas.getImageData(),
            nearestForwardImage: -1,
            nearestBackwardImage: this.numberOfStep,
            numberOfActionOnCanvas: 0, // TODO : this field is not useful anymore.
        }
        this.listOfActions[this.numberOfStep-1].nearestForwardImage = this.currentStep;
    }

    /**
     * This function put the image in the step given in argument.
     * It doesn't change the history.
     * So we can have a currentStep that is not the head of the History.
     * Therefore, we can undo this function.
     * @param  {number} stepNumber The step to reach
     * @return {void} Returns nothing : works by side-effect.
     *
     * @author Josselin GIET
     */
    goToStep(stepNumber: number){
        if (stepNumber > this.numberOfStep || stepNumber < this.firstAvailableStep){
            return;
        }
        let step: HistoryStep = this.listOfActions[stepNumber];

        // We check if we can use the undo function.
        let useUndo: boolean = true;
        if (step.nearestForwardImage == -1)
        {
            useUndo = false; // TODO
        }
        if (useUndo && (stepNumber - step.nearestBackwardImage < step.nearestForwardImage - stepNumber)){
            useUndo = false;
        }
        for(let i = stepNumber + 1; useUndo && (i < step.nearestForwardImage); i++){
            if (this.listOfActions[i].undo != null) { useUndo = false; }
        }
        // Depending on the results of several check above, we use undo function, or not.
        if (useUndo) {
        // Case 1: we use undo functions.
            this.document.imageWorkspace.drawingLayers.selectedLayer.canvas.setImageData(this.listOfActions[step.nearestForwardImage].image);
            for (let i = step.nearestForwardImage-1; i > stepNumber; i--){
                this.listOfActions[i].undo();
            }
        }
        else {
        // Case 2: we use redo functions.
            this.document.imageWorkspace.drawingLayers.selectedLayer.canvas.setImageData(this.listOfActions[step.nearestBackwardImage].image);
            for (let i = step.nearestBackwardImage; i <= stepNumber; i++){
                this.listOfActions[i].redo();
            }
        }
        this.currentStep = stepNumber;
        this.document.imageWorkspace.redrawDrawingLayers();
    // TODO : if we can undo from the current Step, we have to !
    }

    /**
     * This function go to latest step. i.e. : currentStep-1
     * @return {void} Returns nothing : works by side-effect.
     *
     * @author Josselin GIET
     */
    goToLatestStep () {
        this.goToStep(this.currentStep -1);
    }

    /**
     * This function go to next step. i.e. : currentStep+1
     * @return {void} Returns nothing : works by side-effect.
     *
     * @author Josselin GIET
     */
    goToNextStep(){
        this.goToStep(this.currentStep+1);
    }

}
