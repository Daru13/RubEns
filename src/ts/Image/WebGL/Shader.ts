/**
 * Class representing a GLSL shader, used by webGL.
 * The shader can be compiled by a webGl instance, and used in a shader program.
 */
class Shader {

    /**
     * The shader stored by WebGL.
     */
    private webGLShader: WebGLShader;

    /**
     * Delete the shader from WebGL.
     * @param {WebGLRenderingContext} gl    The WebGL context
     *
     * @author Mathieu Fehr
     */
    deleteShader(gl: WebGLRenderingContext) {
        gl.deleteShader(this.webGLShader);
        this.webGLShader = null;
    }

    /**
     * Get the shader stored in WebGL
     * @returns {WebGLShader} The shader stored in WebGL
     *
     * @author Mathieu Fehr
     */
    getWebGLShader() {
        return this.webGLShader;
    }


    /**
     * Construct a new shader with a GLSL source code, and compile it
     *
     * @param {WebGLRenderingContext} gl    The WebGL context
     * @param {string} shaderSourceCode     The shader source code written in GLSL
     * @param {number} shaderType           The shader type (fragment shader, vertex shader)
     *
     * @author Mathieu Fehr
     */
    constructor(gl: WebGLRenderingContext, shaderSourceCode: string, shaderType: number) {
        this.webGLShader = gl.createShader(shaderType);
        gl.shaderSource(this.webGLShader, shaderSourceCode);
        gl.compileShader(this.webGLShader);
    }
}