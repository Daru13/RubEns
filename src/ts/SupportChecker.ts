export class SupportChecker {

    static checkSupport() : boolean {
        return SupportChecker.checkFileAPISupport();
    }

    static checkFileAPISupport() : boolean {
        return  "File" in window &&
                "Blob" in window;
    }
}