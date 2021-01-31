const SCALE = 4;

const offsets = (function* () {
  while (true) {
    yield [0, 0];
    yield [0, 1];
    yield [1, 0];
    yield [1, 1];
  }
})();

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  const W = (canvas.width = innerWidth / SCALE);
  const H = (canvas.height = innerHeight / SCALE);
  canvas.style.width = `${innerWidth}px`;
  canvas.style.imageRendering = "pixelated";
  target.appendChild(canvas);
  const gl = canvas.getContext("webgl")!;

  function createProgram(gl: WebGLRenderingContext, shader: string) {
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
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program)!);
    }
    return program;
  }

  interface BufferData {
    buffer: WebGLFramebuffer;
    texture: WebGLTexture;
    index: number;
  }

  function createBuffer(
    gl: WebGLRenderingContext,
    width: number,
    height: number,
    index: 0 | 2,
  ): BufferData {
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
    return { buffer, texture, index };
  }

  let timerId = -1;
  let frame = 0;

  const computeProgram = createProgram(
    gl,
    `
precision mediump float;
uniform vec2 RESOLUTION;
uniform sampler2D DATA;
uniform vec2 OFFSET;
uniform vec2 CLICK;
uniform int CLICK_STATE;
uniform float FRAME;
// Modified from http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(vec2(co.x - FRAME, co.y + FRAME) ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}
vec4 encode(int val) {
  float r = float(val + 1);
  return vec4(r, val == 0 ? 1.0 : 0.0, val == 1 ? 1.0 : 0.0, 1.0);
}
int at(float x, float y) {
  return int(texture2D(DATA, vec2(x, RESOLUTION.y - y) / RESOLUTION).r) - 1;
}
void main() {
  if (FRAME == 1.0) {
    gl_FragColor = encode(0);
    return;
  }
  float x = gl_FragCoord.x;
  float y = RESOLUTION.y - gl_FragCoord.y;
  gl_FragColor = encode(at(x, y));
  if (x == CLICK.x + 0.5 && y == CLICK.y + 0.5) {
    gl_FragColor = encode(CLICK_STATE);
    return;
  }
  // Walls
  if (y == RESOLUTION.y - 0.5 || x == RESOLUTION.x - 0.5 || x == 0.5) {
    gl_FragColor = encode(2);
    return;
  }
  // Sand source
  if (y == 1.5 && rand(vec2(x, y)) > .99) {
    gl_FragColor = encode(1);
  }
  // Intermediate walls
  if (y == 80.5 && mod(x + 3.0, 23.0) <= 20.5) {
    gl_FragColor = encode(2);
  }
  if (y == 140.5 && mod(x + 19.0, 32.0) <= 23.5) {
    gl_FragColor = encode(2);
  }
  if (y == 210.5 && mod(x + 7.0, 62.0) <= 53.5) {
    gl_FragColor = encode(2);
  }
  vec2 ul;
  ul.x = x - mod(x + OFFSET.x, 2.0) + 0.5;
  ul.y = y - mod(y + OFFSET.y, 2.0) + 0.5;
  
  if (at(ul.x, ul.y) == 1 && at(ul.x, ul.y + 1.0) == 0) {
    if (x == ul.x && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    }
    return;
  }

  if (at(ul.x + 1.0, ul.y) == 1 && at(ul.x + 1.0, ul.y + 1.0) == 0) {
    if (x == ul.x + 1.0 && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x + 1.0 && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    }
    return;
  }

  if (at(ul.x, ul.y) == 1 && at(ul.x + 1.0, ul.y) == 0 && at(ul.x, ul.y + 1.0) == 1 && at(ul.x + 1.0, ul.y + 1.0) == 0) {
    if (x == ul.x && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x + 1.0 && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    } else if (x == ul.x + 1.0 && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    }
    return;
  }

  if (at(ul.x, ul.y) == 0 && at(ul.x + 1.0, ul.y) == 1 && at(ul.x, ul.y + 1.0) == 0 && at(ul.x + 1.0, ul.y + 1.0) == 1) {
    if (x == ul.x && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x + 1.0 && y == ul.y) {
      gl_FragColor = encode(0);
    } else if (x == ul.x && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    } else if (x == ul.x + 1.0 && y == ul.y + 1.0) {
      gl_FragColor = encode(1);
    }
    return;
  }
}
  `,
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  let input: BufferData;
  let output: BufferData;

  input = createBuffer(gl, W, H, 0);
  output = createBuffer(gl, W, H, 2);
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
  gl.uniform2f(
    gl.getUniformLocation(computeProgram, "RESOLUTION"),
    Math.floor(W),
    Math.floor(H),
  );

  function loop() {
    frame++;
    gl.bindFramebuffer(gl.FRAMEBUFFER, output.buffer);
    gl.uniform1i(gl.getUniformLocation(computeProgram, "DATA"), input.index);
    gl.uniform1f(gl.getUniformLocation(computeProgram, "FRAME"), frame);
    gl.uniform2fv(
      gl.getUniformLocation(computeProgram, "OFFSET"),
      offsets.next().value,
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      output.texture,
      0,
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // swap input and output
    [input, output] = [output, input];
    timerId = requestAnimationFrame(loop);
  }

  loop();

  return () => {
    cancelAnimationFrame(timerId);
  };
}
