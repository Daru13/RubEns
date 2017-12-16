import { Document } from "./Document";

type HistoryFunction = () => void;

/**
 * This interface describes an history's "step".
 * redo: the action to apply. Works only by side effect.
 * undo: a function that cancels the result of the edo`function.
 * image: the image before the redo function is apply.
 * nearestForwardImage: the index of the step storring the nearest image in
 *          the following of the history.
 *          Equals -1 if this image doesn't exits.
 * nearestBackwardImage: the index of the step storring the nearest image in
 *          the steps before this one in the history.
 * numberOfActionOnCanvas: the number of actions on canvas since the latest
 *          image storred.
 */
export interface HistoryStep {
    redo: HistoryFunction;
    undo?: HistoryFunction;
    image?: ImageData;
    nearestForwardImage: number;
    nearestBackwardImage: number;
    numberOfActionOnCanvas: number;
}



/**
 * This is a generic history for a single document.
 * It works as follow :
 * - each action is saved in a "HistoryStep" that contains the action
 * and sometimes, a function that cancels it.
 * - In order to save time when we want to go to a previous step,
 * we save image at some step.
 * - We make a difference between actions on canvas and all the other one,
 * since an action on canvas take much time than the other one,
 * we decide that only the number of action on canvas determines the number of step between two images.
 */
export class History {

    /**
     * The document whose history is registered.
     */
    document: Document;

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
     * The constructor that initializes the History
     * by adding an *empty* step with the image in the beginning.
     * @param  {Document} document Returns nothing : works by side-effect.
     * @return {[type]}            A reference to the document whose actions have to be storred.
     *
     * @author Josselin GIET
     */
    constructor(document: Document){
        this.document = document;
        this.listOfActions[0] = {
            // basically, this step is ony useful since it contais an image.
            // the actios are "empty" functions.
            redo: function () { null },
            undo: function () { null },
            image: this.document.imageWorkspace.drawingCanvas.getImageData(),
            nearestForwardImage: 0,
            nearestBackwardImage: 0,
            numberOfActionOnCanvas:0,
        }
        this.numberOfStep = 0;
        this.numberOfImages = 1;
        this.currentStep = 0;
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
            for (var i = this.currentStep+1; i <= this.numberOfStep; i++){
                delete this.listOfActions[i];
            }
            // Then, we correct the number of Step in the current step.
            this.numberOfStep = this.currentStep;
            // Finally, we put the nearestForwardImage of the "new" head of the history.
            for (var i = this.numberOfStep; i < this.listOfActions[this.currentStep].nearestBackwardImage; i++){
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
    apply(redo: HistoryFunction, undo?: HistoryFunction){
        //First, we have to clear the head.
        this.clearHead();
        // Then, we increment the right indices.
        this.currentStep += 1;
        this.numberOfStep += 1;
        this.listOfActions[this.numberOfStep] =
            {redo: redo,
             undo: undo,
             image: null,
             nearestForwardImage: -1,
             nearestBackwardImage: this.listOfActions[this.numberOfStep-1].nearestBackwardImage,
             numberOfActionOnCanvas: this.listOfActions[this.numberOfStep-1].numberOfActionOnCanvas,
        }
        redo();
    }



    /**
     * This function stores the functions given in argument and calls this function,
     * and icreases numberOfActionOnCanvas.
     * @param  {HistoryFunction} redo the function to apply.
     * @param  {HistoryFunction} undo the inverse function of undo.
     * @return {void} Returns nothing : works by side-effect.
     *
     * @author Josselin GIET
     */
    applyOnCanvas(redo: HistoryFunction, undo?: HistoryFunction){
        //First, we have to clear the head.
        this.clearHead();
        // Then, we increment the right indices.
        this.currentStep += 1;
        this.numberOfStep += 1;
        if (this.listOfActions[this.currentStep-1].numberOfActionOnCanvas <= this.boundOnCanvas){
        // Case 1: limit of action on Canvas isn't reached.
        // Therefore we just have to save the step.
            this.listOfActions[this.numberOfStep] =
                {redo: redo,
                 undo: undo,
                 image: null,
                 nearestForwardImage: -1,
                 nearestBackwardImage: this.listOfActions[this.numberOfStep-1].nearestBackwardImage,
                 numberOfActionOnCanvas: this.listOfActions[this.numberOfStep-1].numberOfActionOnCanvas +1,
                }
        }
        else {
        // Case 2: limit of action on Canvas is reached.
            if (this.numberOfImages > this.boundOnImages) {
            // Case 2.1: we have to clear an image and the steps after until the next image.
                var beginning = this.firstAvailableStep;
                var end = this.listOfActions[beginning+1].nearestForwardImage;
                for (let i = beginning; i < end; i++){
                    delete this.listOfActions[i];
                }
                this.firstAvailableStep = end;
            }
            // Then, we store an image.
            var thisStep: number = this.numberOfStep;
            this.listOfActions[thisStep] =
                {redo: redo,
                 undo: undo,
                 image: this.document.imageWorkspace.drawingCanvas.getImageData(),
                 nearestForwardImage: this.numberOfStep,
                 nearestBackwardImage: this.numberOfStep,
                 numberOfActionOnCanvas: this.listOfActions[this.numberOfStep-1].numberOfActionOnCanvas +1,
                }
            this.numberOfImages ++;
            // To finish, We update the nearestForwardImage of the head of the history.
            for (let i: number = this.listOfActions[thisStep-1].nearestBackwardImage+1; i < thisStep; i++){
                this.listOfActions[i].nearestForwardImage = thisStep;
            }
        }
        redo();
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
            alert("Unavailable step!");
            return;
        }
        var step: HistoryStep = this.listOfActions[stepNumber];

        // We check if we can use the undo function.
        var useUndo: boolean = true;
        if (step.nearestForwardImage == -1)
        {
            useUndo = false; // TODO
        }
        if (useUndo && (stepNumber - step.nearestBackwardImage < step.nearestForwardImage - stepNumber)){
            useUndo = false;
        }
        for(var i = stepNumber + 1; useUndo && (i < step.nearestForwardImage); i++){
            if (this.listOfActions[i].undo != null) { useUndo = false; }
        }
        // Depending on the results of several check above, we use undo function, or not.
        if (useUndo) {
        // Case 1: we use undo functions.
            this.document.imageWorkspace.drawingCanvas.setImageData(this.listOfActions[step.nearestForwardImage].image);
            for (var i = step.nearestForwardImage-1; i > stepNumber; i--){
                this.listOfActions[i].undo();
            }
        }
        else {
        // Case 2: we use redo functions.
            this.document.imageWorkspace.drawingCanvas.setImageData(this.listOfActions[step.nearestBackwardImage].image);
            for (var i = step.nearestBackwardImage; i <= stepNumber; i++){
                this.listOfActions[i].redo();
            }
        }
        this.currentStep = stepNumber;
    // TODO : if we can undo from the current Step, we have to !
    }

    /**
     * This function go to latest step. i.e. : currentStep-1
     * @return {void} Returns nothing : works by side-effect.
     *
     * @author Josselin GIET
     */
    goToLatestStep () {
        this.goToStep(0);
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
