const indices = new WeakMap<WebGLRenderingContext, number>();

/** Compile a fragment shader for use with a buffer */
export function createProgram(gl: WebGLRenderingContext, shader: string) {
  const vertex = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(
    vertex,
    `
    precision mediump float;
    attribute vec2 position;
    void main() {
          gl_Position = vec4(position, 0.0, 1.0);
    }
    `,
  );
  gl.compileShader(vertex);
  if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vertex)!);
  }
  const fragment = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fragment, shader);
  gl.compileShader(fragment);
  if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fragment)!);
  }
  const computeProgram = gl.createProgram()!;
  gl.attachShader(computeProgram, vertex);
  gl.attachShader(computeProgram, fragment);
  gl.linkProgram(computeProgram);
  if (!gl.getProgramParameter(computeProgram, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(computeProgram)!);
  }

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(computeProgram);
  const verticesLoc = gl.getAttribLocation(computeProgram, "position");
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(verticesLoc);
  gl.vertexAttribPointer(verticesLoc, 2, gl.FLOAT, false, 0, 0);

  function setUniformInt(name: string, value: number) {
    gl.uniform1i(gl.getUniformLocation(computeProgram, name), value);
  }
  function setUniformFloat(name: string, value: number) {
    gl.uniform1f(gl.getUniformLocation(computeProgram, name), value);
  }
  function setUniformVec2(name: string, value: readonly [number, number]) {
    gl.uniform2f(
      gl.getUniformLocation(computeProgram, name),
      value[0],
      value[1],
    );
  }
  function setUniformSampler2D(
    name: string,
    value: ReturnType<typeof createBuffer>,
  ) {
    gl.uniform1i(gl.getUniformLocation(computeProgram, name), value.index);
  }

  return {
    setUniformInt,
    setUniformSampler2D,
    setUniformFloat,
    setUniformVec2,
  };
}

/** Create a 2d buffer to render to and/or use as an input for a shader */
export function createBuffer(
  gl: WebGLRenderingContext,
  width: number,
  height: number,
) {
  if (!indices.has(gl)) {
    indices.set(gl, 0);
  } else {
    indices.set(gl, indices.get(gl)! + 2);
  }
  const index = indices.get(gl)!;
  const buffer = gl.createFramebuffer()!;
  gl.getExtension("OES_texture_float");
  const texture = gl.createTexture()!;
  gl.activeTexture(gl.TEXTURE0 + index);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    Math.floor(width),
    Math.floor(height),
    0,
    gl.RGBA,
    gl.FLOAT,
    null,
  );
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error("Framebuffer incomplete");
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  function render() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    // Draw to buffer
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // Draw to screen
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  return { buffer, index, render };
}
