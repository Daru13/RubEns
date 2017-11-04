export class DocumentParameters {
    // Title (required)
    title: string = "New document";

    // Dimensions in pixels (required)
    width: number  = 800;
    height: number = 600;

    // Tool parameters (global + local to each tool)
    toolParameters: {
        global: object;

        // Tool-specific parameters will be dynamically added to this object
    };
}
