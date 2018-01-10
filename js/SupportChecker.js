define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Class used to check the support of certain APIs in older browsers.
     */
    class SupportChecker {
        /**
         * Check the support of everything the app needs
         * @return {boolean} `true` if the browser supports the APIs, `false` otherwise.
         *
         * @author Mathieu Fehr
         */
        static checkSupport() {
            return SupportChecker.checkFileAPISupport();
        }
        /**
         * Check the support of the API used for loading files
         * @return {boolean} `true` if the browser supports it, `false` otherwise.
         */
        static checkFileAPISupport() {
            return "File" in window &&
                "Blob" in window;
        }
    }
    exports.SupportChecker = SupportChecker;
});
