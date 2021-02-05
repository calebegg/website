const RADIUS = 20;
const SPEED = 4;

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  target.appendChild(canvas);
  const c = canvas.getContext("2d")!;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = `${innerWidth}px`;
  c.scale(devicePixelRatio, devicePixelRatio);

  let balls: Array<{ x: number; y: number; dx: number; dy: number }> = [];

  function render() {
    c.fillStyle = "rgba(255, 255, 0, .8)";
    c.fillRect(0, 0, innerWidth, innerHeight);
    c.fillStyle = "magenta";
    const angle = Math.random() * 2 * Math.PI;
    if (balls.length < 50 && Math.random() < 0.03) {
      balls.push({
        x: innerWidth / 2,
        y: innerHeight / 2,
        dx: Math.cos(angle) * SPEED,
        dy: Math.sin(angle) * SPEED,
      });
    }
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
