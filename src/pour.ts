import shader from "./pour.glsl";
import { createBuffer, createProgram } from "./webgl";

const SCALE = 4;

const offsets = (function* () {
  while (true) {
    yield [0, 0] as const;
    yield [0, 1] as const;
    yield [1, 0] as const;
    yield [1, 1] as const;
  }
})();

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  const w = (canvas.width = innerWidth / SCALE);
  const h = (canvas.height = innerHeight / SCALE);
  canvas.style.width = `${innerWidth}px`;
  canvas.style.imageRendering = "pixelated";
  target.appendChild(canvas);
  const gl = canvas.getContext("webgl")!;

  let input = createBuffer(gl, w, h);
  let output = createBuffer(gl, w, h);
  const program = createProgram(gl, shader);

  program.setUniformVec2("RESOLUTION", [Math.floor(w), Math.floor(h)]);

  let timerId = -1;
  let frame = 0;
  function loop() {
    frame++;
    program.setUniformSampler2D("DATA", input);
    program.setUniformFloat("FRAME", frame);
    program.setUniformVec2("OFFSET", offsets.next().value);

    output.render();

    // swap input and output
    [input, output] = [output, input];
    timerId = requestAnimationFrame(loop);
  }

  loop();

  return () => {
    cancelAnimationFrame(timerId);
  };
}
