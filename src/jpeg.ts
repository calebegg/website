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

  let frame = 0;
  async function render() {
    frame++;
    let quality = Math.random() * 0.05 + 0.95;
    let offset = Math.random() * 2;
    let tearChance = 0.05;
    if (frame > 400) {
      quality = Math.random() * 0.8 + 0.2;
      offset = Math.random() * 9;
      tearChance = 0.1;
    }
    if (frame > 1000) {
      quality = Math.random();
      offset = Math.random() * 31;
      tearChance = 0.2;
    }
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
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
