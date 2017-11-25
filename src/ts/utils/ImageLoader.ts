import * as $ from "jquery";

export class ImageLoader {

    /**
     * Ask the user for an image file to load, and start loading it.
     *
     * The given callback is given to successive callback functions,
     * so that is can finally be called once the image object is ready.
     * @param {(HTMLImageElement) => void} onImageReady Callback function called when the loaded image is ready.
     *
     * @author Mathieu Fehr, Camille Gobert
     */
    static load (onImageReady: (HTMLImageElement) => void) {
        // The node is used to trigger the image loading
        let inputNode = $("<input>");
        inputNode.attr("type", "file");

        // Function to call when the image is loaded in the HTML node
        inputNode.on("change", (_) => this.onInputNodeChange(<HTMLInputElement> inputNode[0], onImageReady));

        inputNode.hide();
        $(document.body).append(inputNode);

        inputNode.click();
        console.log(inputNode);
    }

    /**
     * Callback function called when a file has been loaded (via an HTML input element).
     * @param {HTMLInputElement}            inputNode    The HTML input element which loads the file.
     * @param {(HTMLImageElement) => void}  onImageReady Callback function called when the loaded image is ready.
     *
     * @author Mathieu Fehr, Camille Gobert
     */
    private static onInputNodeChange (inputNode: HTMLInputElement, onImageReady: (HTMLImageElement) => void) {
      let file = inputNode.files[0];
      let imageType = /image.*/;

      // Loading error
      if (! file) {
          // TODO: better handle such error (e.g. emit an event, display a popup...)
          alert("Error: image could not be loaded.");
      }

      // Unsupported file type
      if (! file.type.match(imageType)) {
          // TODO: better handle such error (e.g. emit an event, display a popup...)
          alert("Error: unsupported file type.");
      }

      this.readLoadedFile(file, onImageReady);
    }


    private static readLoadedFile (file: File, onImageReady: (HTMLImageElement) => void) {
        let reader = new FileReader();

        // Read the file as an image
        let onFileReaderLoad = (_) => {
            reader.removeEventListener("load", onFileReaderLoad);

            // Parse the file content as an image
            let image = new Image();
            let onImageLoaded = (_) => {
                image.removeEventListener("load", onImageLoaded);

                onImageReady(image);
            };
            image.addEventListener("load", onImageLoaded)

            image.src = reader.result;
        };
        reader.addEventListener("load", onFileReaderLoad);

        reader.readAsDataURL(file);
    }

}
