const RES = 4;

const W = Math.floor(innerWidth / RES) + 1;
const H = Math.floor(innerHeight / RES) + 1;

const TH = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21],
];

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  const offscreen = document.createElement("canvas");

  canvas.width = W * RES;
  canvas.height = H * RES;
  offscreen.width = W;
  offscreen.height = H;
  target.appendChild(canvas);

  const c = canvas.getContext("2d")!;
  const o = offscreen.getContext("2d")!;

  c.imageSmoothingEnabled = false;

  c.scale(RES, RES);

  let frame = 0;
  function render() {
    const image = c.createImageData(W, H);
    frame++;
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        const t = Math.sqrt((x - W / 2) ** 2 + (y - H / 2) ** 2) / 120;
        const v =
          Math.sin(t - frame / 120) +
          Math.sin(Math.sqrt(5) * t - frame / 17) +
          Math.sin(Math.sqrt(2) * t - frame / 143) +
          Math.sin(Math.sqrt(3) * t + frame / 29);
        const pass = v * 32 + 32 - 0.5 < TH[x % TH.length][y % TH.length];
        //c.fillRect(x, y, 1, 1);
        image.data[(x + y * W) * 4] = 255;
        image.data[(x + y * W) * 4 + 1] = pass ? 0 : 255;
        image.data[(x + y * W) * 4 + 2] = !pass ? 0 : 255;
        image.data[(x + y * W) * 4 + 3] = 255;
      }
    }
    o.putImageData(image, 0, 0);
    c.drawImage(offscreen, 0, 0);

    handle = requestAnimationFrame(render);
  }

  let handle = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(handle);
  };
}
