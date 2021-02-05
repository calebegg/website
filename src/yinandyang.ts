const SPEED = 1;

export function main(target: HTMLElement) {
  const radius = innerWidth / 20;
  const canvas = document.createElement("canvas");
  target.appendChild(canvas);
  const c = canvas.getContext("2d")!;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = `${innerWidth}px`;
  c.scale(devicePixelRatio, devicePixelRatio);
  c.fillStyle = "yellow";
  c.fillRect(0, 0, innerWidth, innerHeight);
  c.fillStyle = "magenta";
  c.fillRect(0, innerHeight / 2, innerWidth, innerHeight);
  let x = innerWidth / 2;
  let y = innerHeight / 4;
  let theta = Math.random() * 2 * Math.PI;

  function render() {
    c.fillStyle = "magenta";
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(innerWidth - x, y, radius, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "yellow";
    c.beginPath();
    c.arc(x, innerHeight - y, radius, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(innerWidth - x, innerHeight - y, radius, 0, Math.PI * 2);
    c.fill();

    x += Math.cos(theta) * 5;
    y += Math.sin(theta) * 5;
    if (x > innerWidth + radius) {
      x = -radius;
    } else if (x < -radius) {
      x = innerWidth + radius;
    }
    if (y > innerHeight + radius) {
      y = -radius;
    } else if (y < -radius) {
      y = innerHeight + radius;
    }
    theta += (Math.random() - 0.5) * 0.25;

    handle = requestAnimationFrame(render);
  }

  let handle = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(handle);
  };
}
