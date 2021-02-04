const SPEED = 10;

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  target.appendChild(canvas);
  const c = canvas.getContext("2d")!;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = `${innerWidth}px`;
  c.scale(devicePixelRatio, devicePixelRatio);

  c.fillStyle = "yellow";
  c.fillRect(0, 0, innerWidth, innerHeight);
  c.strokeStyle = "magenta";
  c.lineWidth = 8;

  let x = innerWidth / 2;
  let y = innerHeight / 2;

  let theta = Math.PI * 2 * Math.random();
  let dx = Math.cos(theta) * SPEED;
  let dy = Math.sin(theta) * SPEED;

  function render() {
    c.moveTo(x, y);
    c.lineTo(x + dx, y + dy);
    c.stroke();
    x += dx;
    y += dy;
    if (x < 0 || x > innerWidth) {
      dx = -dx;
    }
    if (y < 0 || y > innerHeight) {
      dy = -dy;
    }

    handle = requestAnimationFrame(render);
  }

  let handle = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(handle);
  };
}
