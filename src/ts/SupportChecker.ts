/**
 * Class used to check the support of certain APIs in older browsers.
 */
export class SupportChecker {

    /**
     * Check the support of everything the app needs
     * @return {boolean} `true` if the browser supports the APIs, `false` otherwise.
     *
     * @author Mathieu Fehr
     */
    static checkSupport() : boolean {
        return SupportChecker.checkFileAPISupport();
    }

    /**
     * Check the support of the API used for loading files
     * @return {boolean} `true` if the browser supports it, `false` otherwise.
     */
    static checkFileAPISupport() : boolean {
        return  "File" in window &&
                "Blob" in window;
    }
}
