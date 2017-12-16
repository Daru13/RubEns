import { Document } from "./Document";

type HistoryFunction = () => void;

/**
 * This interface describes an history's "step".
 * redo: the action to apply. Works only by side effect.
 * undo: a function that cancels the result of the edo`function.
 * image: the image before the redo function is apply
 * nearestForwardImage: the index of the step storring the nearest image in
 *          the following of the history.
 *          Equals -1 if this image doesn't exits
 * nearestBackwardImage: the index of the step storring the nearest image in
 *          the steps before this one in the history
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




export class History {

    document: Document;
    listOfActions: HistoryStep[] = [];
    firstAvailableStep: number = 0;
    numberOfStep: number = 0;
    numberOfImages: number = 0;
    currentStep: number = 0;

    /**
     * The constructor that initializes the History
     * by adding an *empty* step with the image in the beginning.
     * @return {[void]} Returns nothing : works by side-effect.
     */
    constructor(document: Document){
        // console.log("On appelle le constructeur")
        this.document = document;
        this.listOfActions[0] = {
            redo: function () { null }, // TODO: find a solution
            undo: null,
            image: this.document.imageWorkspace.drawingCanvas.getImageData(),
            nearestForwardImage: 0,
            nearestBackwardImage: 0,
            numberOfActionOnCanvas:0,
        }
        this.numberOfStep = 1;
        this.numberOfImages = 1;
        this.currentStep = 0;
    }


    //Maybe a function to initiate the listOfActions (e.g. with the new image)

    boundOnImages: number = 10;
    boundOnCanvas: number = 10;

    clearHead() {
        if (this.currentStep < this.numberOfStep) {
        // First, we have to clear the hstory, for the current step is not the head of history
            for (var i = this.currentStep+1; i <this.numberOfStep; i++){
                delete this.listOfActions[i];
            }
            this.numberOfStep = this.numberOfStep;
            for (var i = this.numberOfStep; i < this.listOfActions[this.currentStep].nearestBackwardImage; i++){
                this.listOfActions[i].nearestForwardImage = -1;
            }

        }
    }

    /**
     * This function stores the functions given in argument.
     * @param  {HistoryFunction} redo [description]
     * @param  {HistoryFunction} undo [description]
     * @return {void}
     */
    apply(redo: HistoryFunction, undo?: HistoryFunction){
        this.clearHead();
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
     * This function stores the functions given in argument and calls this function.
     * And icreases numberOfActionOnCanvas
     * @param  {HistoryFunction} redo the function to apply.
     * @param  {HistoryFunction} undo the inverse function of undo.
     * @return {void} works by side-effect.
     */
    applyOnCanvas(redo: HistoryFunction, undo?: HistoryFunction){
        this.clearHead();
        this.currentStep += 1;
        this.numberOfStep += 1;
        // Then, we increment the numpber of steps.
        if (this.listOfActions[this.currentStep-1].numberOfActionOnCanvas <= this.boundOnCanvas){
        // Case 1: limit of action on Canvas isn't reached
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
            for (let i: number = this.listOfActions[thisStep-1].nearestBackwardImage+1; i < thisStep; i++){
                this.listOfActions[i].nearestForwardImage = thisStep;
            }

            this.listOfActions[this.numberOfStep] =
                {redo: redo,
                 undo: undo,
                 image: this.document.imageWorkspace.drawingCanvas.getImageData(),
                 nearestForwardImage: this.numberOfStep,
                 nearestBackwardImage: this.numberOfStep,
                 numberOfActionOnCanvas: this.listOfActions[this.numberOfStep-1].numberOfActionOnCanvas +1,
                }
            this.numberOfImages ++;
        }
        redo();
    }


    goToStep(stepNumber: number){
        if (stepNumber > this.numberOfStep || stepNumber < this.firstAvailableStep){
            alert("Unavailable step!");
            return;
        }
        var step: HistoryStep = this.listOfActions[stepNumber];

        // We check if we can use the undo function.
        var useUndo: boolean = true;
        if (step.nearestForwardImage == -1){ useUndo = false; }
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
    // TODO: if we can redo from the current Step, we have to !
    }

    goToLatestStep () {
        this.goToStep(0);
    }

    goToNextStep(){
        this.goToStep(this.currentStep+1);
    }

}
