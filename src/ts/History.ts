import { Document } from "./Document";

type HistoryFunction = () => void;


export interface HistoryStep {
    redo: HistoryFunction;
    undo?: HistoryFunction;
    image?: ImageData;
    nearestForwardImage: number;
    nearestBackwardImage: number;
    numberOfActionOnCanvs: number;
}

export interface HistoryMap {
    map: HistoryStep[];
    firstAvailableStep: number;
    numberOfStep: number;
    numberOfImages: number;
    currentStep: number;
}

export class History {
    historyMap: HistoryMap;
    apply: (redo: HistoryFunction, undo?: HistoryFunction) => void;
    applyOnCanvas: (redo: HistoryFunction, undo?: HistoryFunction) => void;
    goToStep: (step: number) => void;
}

export class ImageHistory implements History {


    historyMap = {
        map: [],
        firstAvailableStep: 0,
        numberOfStep: 0,
        numberOfImages: 0,
        currentStep: 0,
    };

    //Maybe a function to initiate the map (e.g. with the new image)

    boundOnImages: number = 10;
    boundOnCanvas: number = 10;

    /**
     * This function stores the functions given in argument.
     * @param  {HistoryFunction} redo [description]
     * @param  {HistoryFunction} undo [description]
     * @return {void}
     */
    apply(redo: HistoryFunction, undo?: HistoryFunction){
        if (this.historyMap.currentStep < this.historyMap.numberOfStep) {
        // First, we have to clear the hstory, for the current step is not the head of history
            for (var i = this.historyMap.currentStep+1; i <this.historyMap.numberOfStep; i++){
                this.historyMap.map[i] = null;
            }
            this.historyMap.numberOfStep = this.historyMap.numberOfStep;
            for (var i = this.historyMap.numberOfStep; i < this.historyMap.map[this.historyMap.currentStep].nearestBackwardImage; i++){
                this.historyMap.map[i].nearestForwardImage = -1;
            }

        }
        this.historyMap.currentStep += 1;
        this.historyMap.numberOfStep += 1;
        this.historyMap.map[this.historyMap.numberOfStep] =
            {redo: redo,
             undo: undo,
             image: null,
             nearestForwardImage: -1,
             nearestBackwardImage: this.historyMap.map[this.historyMap.numberOfStep-1].nearestBackwardImage,
             numberOfActionOnCanvs: this.historyMap.map[this.historyMap.numberOfStep-1].numberOfActionOnCanvs,
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
        this.clearHead;
        this.currentStep += 1;
        this.numberOfStep += 1;
        // Then, we increment the numpber of steps.
        if (this.map[this.currentStep-1].numberOfActionOnCanvas <= this.boundOnCanvas){
        // Case 1: limit of action on Canvas isn't reached
            this.map[this.numberOfStep] =
                {redo: redo,
                 undo: undo,
                 image: null, //TODO: add getImageData
                 nearestForwardImage: -1,
                 nearestBackwardImage: this.map[this.numberOfStep-1].nearestBackwardImage,
                 numberOfActionOnCanvas: this.map[this.numberOfStep-1].numberOfActionOnCanvas +1,
            }
        }
        else {
        // Case 2: limit of action on Canvas is reached.
            if (this.numberOfImages > this.boundOnImages) {
            // Case 2.1: we have to clear an image and the steps after until the next image associated.
                var beginning = this.firstAvailableStep;
                var end = this.map[beginning+1].nearestForwardImage;
                for (let i = beginning; i < end; i++){
                    delete this.map[i];
                }
                this.firstAvailableStep = end;
            }
            // Then, we
            var thisStep: number = this.numberOfStep;
            for (let i: number = this.map[thisStep-1].nearestBackwardImage+1; i < thisStep; i++){
                this.map[i].nearestForwardImage = thisStep;
            }

            this.map[this.numberOfStep] =
                {redo: redo,
                 undo: undo,
                 image: this.document.imageWorkspace.drawingCanvas.getImageData(),
                 nearestForwardImage: this.numberOfStep,
                 nearestBackwardImage: this.numberOfStep,
                 numberOfActionOnCanvas: this.map[this.numberOfStep-1].numberOfActionOnCanvas +1,
                }
            this.numberOfImages ++;
        }
        redo();
    }


    goToStep(stepNumber: number){
        if (stepNumber > this.numberOfStep || stepNumber < this.firstAvailableStep){
            return null;
        }
        var step: HistoryStep = this.map[stepNumber];

        // We check if we can use the undo function.
        var useUndo: boolean = true;
        if (step.nearestForwardImage == -1){ useUndo = false; }
        if (useUndo && (stepNumber - step.nearestBackwardImage < step.nearestForwardImage - stepNumber)){
            useUndo = false;
        }
        for(var i = stepNumber + 1; useUndo && (i < step.nearestForwardImage); i++){
            if (this.map[i].undo != null) { useUndo = false; }
        }
        // Dependeing on the results of several check above, we use undo function, or not.
        if (useUndo) {
        // Case 1: we use undo functions.
            this.document.imageWorkspace.drawingCanvas.setImageData(this.map[step.nearestForwardImage].image);
            for (var i = step.nearestForwardImage-1; i > stepNumber; i--){
                this.map[i].undo();
            }
        }
        else {
        // Case 2: we use redo functions.
            this.document.imageWorkspace.drawingCanvas.setImageData(this.map[step.nearestBackwardImage].image)1y2,;
            for (var i = step.nearestBackwardImage; i <= stepNumber; i++){
                this.map[i].redo();
            }
        }
        this.currentStep = stepNumber;
    // TODO: if we can redo from the current Step, we have to !
    }

    goToLatestStep(){
        this.goToStep(this.currentStep-1);
    }

    goToNextStep(){
        this.goToStep(this.currentStep+1);
    }

}
