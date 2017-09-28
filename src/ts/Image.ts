
export class Image {

    // Related canvas and its context
    private canvas          = null;
    private canvas2DContext = null;

    constructor (canvas) {
        this.canvas          = canvas;
        this.canvas2DContext = canvas.getContext("2d");
    }

    getImageData () {
        return this.canvas2DContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    setImageData (data: ImageData) {
        this.canvas2DContext.putImageData(data, 0, 0);
    }

}
