
/**
 * A Shader Program, which contains multiple shaders,
 */
class Program {

    /**
     * The program stored by WebGL
     */
    private webGLProgram: WebGLProgram;

    /**
     * The shaders previously attached
     */
    private attachedShaders: Array<WebGLShader>;


    /**
     * Create a new program, with no shader attached
     * @param {WebGLRenderingContext} gl The webGL context
     *
     * @author Mathieu Fehr
     */
    constructor(gl: WebGLRenderingContext) {
        this.webGLProgram = gl.createProgram();
        this.attachedShaders = [];
    }


    /**
     * Add a shader to the program
     *
     * @param {WebGLRenderingContext} gl The WebGL context
     * @param {Shader} shader The shader to add
     *
     * @author Mathieu Fehr
     */
    addShader(gl: WebGLRenderingContext, shader: Shader) {
        gl.attachShader(this.webGLProgram, shader);
        this.attachedShaders.push(shader.getWebGLShader());
    }


    /**
     * Link the WebGL program
     * @param {WebGLRenderingContext} gl The WebGL context
     *
     * @author Mathieu Fehr
     */
    linkProgram(gl: WebGLRenderingContext) {
        gl.linkProgram(this.webGLProgram);
        this.detachShaders(gl);

        if (!gl.getProgramParameter(this.webGLProgram, gl.LINK_STATUS)) {
            let linkErrLog = gl.getProgramInfoLog(this.webGLProgram);
            console.log("Shader program did not link successfully. "
                + "Error log: " + linkErrLog);
            this.deleteProgram(gl);
        }
    }


    /**
     * Detach all the shaders attached to the program
     * @param {WebGLRenderingContext} gl The WebGL context
     *
     * @author Mathieu Fehr
     */
    detachShaders(gl: WebGLRenderingContext) {
        this.attachedShaders.forEach((shader) => {
            gl.detachShader(this.webGLProgram, shader);
        });
        this.attachedShaders = [];
    }


    /**
     * Delete the current program
     * @param {WebGLRenderingContext} gl The WebGL context
     *
     * @author Mathieu Fehr
     */
    deleteProgram(gl: WebGLRenderingContext) {
        gl.deleteProgram(this.webGLProgram);
        this.webGLProgram = null;
    }
}