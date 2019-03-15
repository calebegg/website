const dpr = devicePixelRatio || 1;

const W = window.innerWidth;
const H = window.innerHeight;

export function main(target: HTMLElement) {
  let canvas = document.createElement("canvas");
  target.appendChild(canvas);

  let c = canvas.getContext("2d")!;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = `${W}px`;
  c.scale(dpr, dpr);
  const DIM = 20;
  const RADIUS = 12;

  interface Particle {
    x: number;
    y: number;
    dx: number;
    dy: number;
  }

  const vectors = [] as [number, number][][];
  const particles = [] as Particle[];

  for (let row = 0; row < DIM; row++) {
    vectors.push([]);
    for (let col = 0; col < DIM; col++) {
      vectors[row][col] = [0, 0];
    }
  }

  for (let i = 0; i < 200; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      dx: 0,
      dy: 0,
    });
  }

  c.strokeStyle = "#0ff";
  c.lineWidth = 4;
  c.lineCap = "round";

  const handle = setInterval(() => {
    c.fillStyle = "#ff0";
    c.fillRect(0, 0, W, H);

    // Normalize
    for (let row = 0; row < DIM; row++) {
      let avgX = vectors[row].map(([x]) => x).reduce((l, r) => l + r) / DIM;
      vectors[row] = vectors[row].map(
        ([x, y]) => [x - avgX * 0.1, y] as [number, number],
      );
    }
    for (let col = 0; col < DIM; col++) {
      let avgY =
        vectors
          .map(r => r[col])
          .map(([, y]) => y)
          .reduce((l, r) => l + r) / DIM;
      for (let row = 0; row < DIM; row++) {
        vectors[row][col][1] -= avgY * 0.1;
      }
    }

    c.fillStyle = "rgba(255, 0, 255, 1)";
    for (let p of particles) {
      let { x, y } = p;
      c.beginPath();
      c.arc(x, y, RADIUS, 0, Math.PI * 2);
      c.fill();
      if (x < RADIUS) {
        c.beginPath();
        c.arc(x + W, y, RADIUS, 0, Math.PI * 2);
        c.fill();
      }
      if (x - W > -RADIUS) {
        c.beginPath();
        c.arc(x - W, y, RADIUS, 0, Math.PI * 2);
        c.fill();
      }
      if (y < RADIUS) {
        c.beginPath();
        c.arc(x, y + H, RADIUS, 0, Math.PI * 2);
        c.fill();
      }
      if (y - H > -RADIUS) {
        c.beginPath();
        c.arc(x, y - H, RADIUS, 0, Math.PI * 2);
        c.fill();
      }
      let col = Math.floor(x / (W / DIM));
      let row = Math.floor(y / (H / DIM));
      p.dx += vectors[row][col][0] * 0.3;
      p.dy += vectors[row][col][1] * 0.3;
      vectors[row][col][0] += p.dx * 0.05;
      vectors[row][col][1] += p.dy * 0.05;
      p.dx *= 0.8;
      p.dy *= 0.8;
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x += W;
      if (p.y < 0) p.y += H;
      if (p.x > W) p.x -= W;
      if (p.y > H) p.y -= H;
    }
    const lucky = particles[Math.floor(Math.random() * particles.length)];
    const randomAngle = Math.random() * 2 * Math.PI;
    lucky.dx += Math.sin(randomAngle) * 0.85;
    lucky.dy += Math.cos(randomAngle) * 0.85;

    c.globalCompositeOperation = "difference";
    for (let row = 0; row < DIM; row++) {
      for (let col = 0; col < DIM; col++) {
        let vector = vectors[row][col];
        vector[0] *= 0.995;
        vector[1] *= 0.995;
        let magnitudeSquared = vector[0] ** 2 + vector[1] ** 2;
        if (magnitudeSquared > 1) {
          vector[0] = vector[0] / magnitudeSquared;
          vector[1] = vector[1] / magnitudeSquared;
        }
        c.beginPath();
        let x = (col * W) / DIM + 10;
        let y = (row * H) / DIM + 10;
        c.moveTo(x, y);
        c.lineTo(
          x + ((vector[0] * W) / DIM) * 0.75,
          y + ((vector[1] * H) / DIM) * 0.75,
        );
        c.stroke();
      }
    }
    c.globalCompositeOperation = "source-over";
  }, 16);

  return () => {
    clearInterval(handle);
  };
}
