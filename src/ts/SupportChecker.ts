/**
 * Class used to check support of some API for old browsers
 */
export class SupportChecker {

    /**
     * Check the support of everything the app needs
     *
     * @return return true if the browser support the necessary APIs
     *
     * @author Mathieu Fehr
     */
    static checkSupport() : boolean {
        return SupportChecker.checkFileAPISupport();
    }

    /**
     * Check the support of the api used for loading files
     *
     * @returns return true if the browser support the necessary APIs
     */
    static checkFileAPISupport() : boolean {
        return  "File" in window &&
                "Blob" in window;
    }
}