let iter = 0;
const dpr = devicePixelRatio || 1;

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  const w = (canvas.width = window.innerWidth * dpr);
  const h = (canvas.height = window.innerHeight * dpr);
  canvas.style.width = `${innerWidth}px`;
  target.appendChild(canvas);

  const c = canvas.getContext("2d")!;
  c.scale(dpr, dpr);

  c.fillStyle = "magenta";
  c.fillRect(0, 0, w, h);
  c.fillStyle = "yellow";
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(w, 0);
  c.lineTo(w, h);
  c.fill();

  c.scale(1 / dpr, 1 / dpr);

  async function render() {
    let thisIter = iter;

    const img = await new Promise<HTMLImageElement>((r) => {
      const i = new Image();
      i.src = canvas.toDataURL("image/jpeg", Math.random() ** 4 + 0.01);
      i.addEventListener("load", () => {
        r(i);
      });
    });

    c.drawImage(
      img,
      0,
      0,
      w * dpr,
      h * dpr,
      -w / h,
      -h / w,
      w * dpr + (w / h) * 4,
      h * dpr + (h / w) * 4,
    );

    if (thisIter === iter) handle = requestAnimationFrame(render);
  }
  let handle = requestAnimationFrame(render);

  return () => {
    iter++;
    cancelAnimationFrame(handle);
  };
}
