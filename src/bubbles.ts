export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  target.appendChild(canvas);
  const c = canvas.getContext("2d")!;
  canvas.width = innerWidth * 2;
  canvas.height = innerHeight * 2;
  canvas.style.width = `${innerWidth}px`;
  c.scale(2, 2);

  c.fillStyle = "yellow";
  c.fillRect(0, 0, innerWidth, innerHeight);
  c.strokeStyle = "magenta";
  c.lineWidth = 8;

  interface Particle {
    x: number;
    y: number;
    age: number;
    r: number;
  }

  function particle() {
    return {
      x: ((Math.random() - 0.5) * innerWidth) / 4,
      y: ((Math.random() - 0.5) * innerHeight) / 4,
      age: 1,
      r: 0,
    };
  }

  const particles: Particle[] = Array.from({ length: 5 }).map(() => particle());

  function distsq(p: Particle, o: Particle) {
    return (o.x - p.x) ** 2 + (o.y - p.y) ** 2;
  }

  function render() {
    c.fillStyle = "rgba(255, 255, 0, .5)";
    c.fillRect(0, 0, innerWidth, innerHeight);
    c.fillStyle = "magenta";

    for (const p of particles) {
      p.age++;
      p.r += 1;
    }

    for (const p of particles) {
      for (const o of particles) {
        if (p === o) continue;
        const d2 = distsq(p, o);
        if ((p.r + o.r) ** 2 > d2) {
          const overlap = p.r + o.r - Math.sqrt(d2);
          p.r = Math.min(p.r, p.r - overlap * (o.age / (p.age + o.age)));
        }
        if (d2 > 150 ** 2) continue;
        p.x -= ((o.x - p.x) / d2) * 70;
        p.y -= ((o.y - p.y) / d2) * 70;
      }
    }

    for (const p of particles) {
      if (p.r > 150) {
        p.r = 150;
      }
      if (p.r < 8) {
        p.r = 8;
      }
      c.beginPath();
      c.ellipse(
        p.x + innerWidth / 2,
        p.y + innerHeight / 2,
        p.r - 4,
        p.r - 4,
        0,
        0,
        2 * Math.PI,
      );
      // c.fill();
      c.stroke();
    }

    for (const [i, p] of particles.entries()) {
      if (
        Math.abs(p.x) > innerWidth / 2 + 180 ||
        Math.abs(p.y) > innerHeight / 2 + 180
      ) {
        particles.splice(i, 1);
      }
    }

    if (particles.length < 400 && Math.random() < 0.7) {
      for (let i = 0; i < 1; i++) {
        const p = particle();
        if (particles.every(o => distsq(o, p) > o.r ** 2)) {
          particles.push(p);
        }
      }
    }

    handle = requestAnimationFrame(render);
  }

  let handle = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(handle);
  };
}
