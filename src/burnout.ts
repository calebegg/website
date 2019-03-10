export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  const offscreen = document.createElement("canvas");

  const RES = 6;

  const G_THRESHOLD = 250;
  const B_THRESHOLD = 50;

  const W = Math.floor(innerWidth / RES);
  const H = Math.floor(innerHeight / RES);
  canvas.width = W * RES;
  canvas.height = H * RES;
  offscreen.width = W;
  offscreen.height = H;
  target.appendChild(canvas);

  const c = canvas.getContext("2d")!;
  const o = offscreen.getContext("2d")!;

  c.imageSmoothingEnabled = false;
  c.scale(RES, RES);

  o.fillStyle = "yellow";
  o.fillRect(0, 0, W, H);
  const fDim = 5;

  let frame = 0;

  function render() {
    function futz(
      fx = Math.floor(Math.random() * W - fDim),
      fy = Math.floor(Math.random() * H - fDim),
    ) {
      if (at(fx, fy).g < 230) return;
      for (let dx = 0; dx < fDim; dx++) {
        for (let dy = 0; dy < fDim; dy++) {
          set(
            fx + dx,
            fy + dy,
            Math.random() * 255,
            Math.random() < 0.4 ? 255 : 0,
          );
        }
      }
    }
    const image = o.getImageData(0, 0, W, H);
    const output = o.getImageData(0, 0, W, H);

    if (frame == 0) {
      futz(Math.floor(W / 2), Math.floor(H / 2));
    }
    frame++;

    function at(x: number, y: number) {
      if (x < 0 || x >= W || y < 0 || y >= H) return { g: 0, b: 0 };
      const i = (y * W + x) * 4;
      return {
        g: image.data[i + 1],
        b: image.data[i + 2],
      };
    }
    function set(x: number, y: number, g: number, b: number) {
      const i = (y * W + x) * 4;
      output.data[i + 1] = g;
      output.data[i + 2] = b;
    }

    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        const { g, b } = at(x, y);
        if (b === 255 && Math.random() < 0.5) continue;
        if (g < 255) {
          set(x, y, 255 - (254 - g) * 0.984, b - Math.random() * 2 - 8);
        }
        if (g < G_THRESHOLD) continue;
        const passing =
          at(x - 1, y).b > B_THRESHOLD
            ? 1
            : 0 + at(x + 1, y).b > B_THRESHOLD
            ? 1
            : 0 + at(x, y - 1).b > B_THRESHOLD
            ? 1
            : 0 + at(x, y + 1).b > B_THRESHOLD
            ? 1
            : 0;
        if (passing > Math.random() * 6) {
          set(x, y, 0, 255);
        }
      }
    }

    if (frame % 50 == 0) {
      futz();
    }

    o.putImageData(output, 0, 0);

    c.drawImage(offscreen, 0, 0);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
