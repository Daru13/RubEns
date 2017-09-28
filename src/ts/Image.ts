
export class Image {

    // Related canvas and its context
    private canvas          = null;
    private canvas2DContext = null;

    constructor (canvas) {
        this.canvas          = canvas;
        this.canvas2DContext = canvas.getContext("2d");
    }

    getImageData () {
        return this.canvas2DContext.getImageData();
    }

    setImageData (data: ImageData) {
        this.canvas2DContext.putImageData(data);
    }

}
