let iter = 0;

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  const w = (canvas.width = innerWidth);
  const h = (canvas.height = innerHeight);
  canvas.style.width = `${innerWidth}px`;
  target.appendChild(canvas);

  const c = canvas.getContext("2d")!;

  c.fillStyle = "yellow";
  c.fillRect(0, 0, innerWidth, innerHeight);
  c.fillStyle = "magenta";
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(0, innerHeight);
  c.lineTo(innerWidth, innerHeight);
  c.fill();

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
      w,
      h,
      -w / h,
      -h / w,
      w + (w / h) * 2,
      h + (h / w) * 2,
    );

    if (thisIter === iter) handle = requestAnimationFrame(render);
  }
  let handle = requestAnimationFrame(render);

  return () => {
    iter++;
    cancelAnimationFrame(handle);
  };
}
