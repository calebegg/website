const RADIUS = 10;
const SPEED = 4;

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  target.appendChild(canvas);
  const c = canvas.getContext("2d")!;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = `${innerWidth}px`;
  c.scale(devicePixelRatio, devicePixelRatio);

  const balls = Array.from({ length: 100 }, () => {
    const theta = Math.random() * 2 * Math.PI;
    return {
      x: innerWidth * Math.random(),
      y: innerHeight * Math.random(),
      dx: Math.cos(theta) * SPEED,
      dy: Math.sin(theta) * SPEED,
    };
  });

  function render() {
    c.fillStyle = "rgba(255, 255, 0, .5)";
    c.fillRect(0, 0, innerWidth, innerHeight);
    c.fillStyle = "magenta";
    for (const b of balls) {
      b.x += b.dx;
      b.y += b.dy;
      if (b.x < RADIUS) {
        b.x = RADIUS;
        b.dx = -b.dx;
      } else if (b.x > innerWidth - RADIUS) {
        b.x = innerWidth - RADIUS;
        b.dx = -b.dx;
      } else if (b.y < RADIUS) {
        b.y = RADIUS;
        b.dy = -b.dy;
      } else if (b.y > innerHeight - RADIUS) {
        b.y = innerHeight - RADIUS;
        b.dy = -b.dy;
      } else {
        for (const o of balls) {
          if (
            o !== b &&
            Math.sqrt((b.x - o.x) ** 2 + (b.y - o.y) ** 2) < RADIUS * 1.9
          ) {
            const theta = Math.atan2(b.y - o.y, b.x - o.x);
            b.dx = Math.cos(theta) * SPEED;
            b.dy = Math.sin(theta) * SPEED;
          }
        }
      }
      c.beginPath();
      c.arc(b.x, b.y, RADIUS, 0, Math.PI * 2);
      c.fill();
    }

    handle = requestAnimationFrame(render);
  }

  let handle = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(handle);
  };
}
