const SPEED = 8;
const RADIUS = 10;

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
  c.fillStyle = "magenta";
  c.lineWidth = 4;

  const particles: Array<{
    x: number;
    y: number;
    still: number;
    done: boolean;
  }> = [];
  function render() {
    if (Math.random() < 0.2 && particles.length < 500) {
      particles.push({
        x: Math.random() * innerWidth,
        y: -RADIUS,
        still: 0,
        done: false,
      });
    }
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (const [i, p] of particles.entries()) {
      p.y += SPEED;
      if (p.y + RADIUS > innerHeight) {
        p.y = innerHeight - RADIUS;
        p.still++;
      } else {
        for (const o of particles) {
          if (p === o) continue;
          while (Math.sqrt((p.x - o.x) ** 2 + (p.y - o.y) ** 2) < RADIUS * 2) {
            p.y--;
            p.done = true;
          }
        }
      }
      if (p.still > 200) {
        particles.splice(i, 1);
      }
    }
    for (const p of particles) {
      c.beginPath();
      c.arc(p.x, p.y, RADIUS, 0, Math.PI * 2);
      c.fill();
    }
    handle = requestAnimationFrame(render);
  }

  let handle = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(handle);
  };
}
