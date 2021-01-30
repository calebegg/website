let iter = 0;

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth * 2;
  canvas.height = window.innerHeight * 2;
  canvas.style.width = `${innerWidth}px`;
  target.appendChild(canvas);

  const c = canvas.getContext("2d")!;
  c.scale(2, 2);

  c.fillStyle = "magenta";
  c.fillRect(0, 0, innerWidth / 2, innerHeight);
  c.fillStyle = "yellow";
  c.fillRect(innerWidth / 2, 0, innerWidth / 2, innerHeight);

  c.scale(0.5, 0.5);

  async function render() {
    let thisIter = iter;
    let quality = Math.random();
    let offset = Math.random() * 13;
    let tearChance = 0.1;
    const img = await new Promise<HTMLImageElement>(r => {
      const i = new Image();
      i.src = canvas.toDataURL("image/jpeg", quality);
      i.addEventListener("load", () => {
        r(i);
      });
    });

    const cutoff = Math.random() * innerHeight * 2;

    c.drawImage(
      img,
      0,
      0,
      innerWidth * 2,
      cutoff,
      Math.random() > tearChance ? 0 : Math.random() < 0.5 ? -offset : offset,
      1,
      innerWidth * 2,
      cutoff,
    );

    c.drawImage(
      img,
      0,
      cutoff,
      innerWidth * 2,
      innerHeight * 2 - cutoff,
      Math.random() > tearChance ? 0 : Math.random() < 0.5 ? -offset : offset,
      cutoff + 1,
      innerWidth * 2,
      innerHeight * 2 - cutoff,
    );
    if (thisIter === iter) handle = requestAnimationFrame(render);
  }
  let handle = requestAnimationFrame(render);

  return () => {
    iter++;
    cancelAnimationFrame(handle);
  };
}
