export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  target.appendChild(canvas);

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  canvas.width = WIDTH * devicePixelRatio;
  canvas.height = HEIGHT * devicePixelRatio;
  canvas.style.width = `${WIDTH}px`;

  const c = canvas.getContext("2d")!;
  c.scale(devicePixelRatio, devicePixelRatio);

  interface Wave {
    ys: number[];
    dys: number[];
    age: number;
    peak: number[];
  }

  let waves: Wave[] = [];

  function startWave(first = false) {
    let ys = [];
    let dys = [];
    let peak = [];
    let speed = ((Math.random() + 2) * HEIGHT) / 600;
    if (first) speed = 2;
    for (let j = 0; j < WIDTH; j++) {
      ys.push(0);
      dys.push(speed + (Math.random() - 0.5) * 15);
      peak.push(0);
    }
    waves.push({ ys, dys, age: 0, peak });
  }
  startWave(true);

  let frame = 0;

  c.fillStyle = "#f0f";
  c.fillRect(0, 0, WIDTH, HEIGHT);

  function render() {
    frame++;

    let prevWave: Wave | null = null;
    for (const { age, peak } of waves) {
      c.fillStyle = `hsl(${-60 + 9000 / age}deg, 100%, 50%)`;
      for (let i = 0; i < WIDTH; i++) {
        c.fillRect(i, HEIGHT - peak[i], 1, HEIGHT);
      }
    }
    for (let wave of waves) {
      wave.age++;
      const { age, ys, peak, dys } = wave;
      c.fillStyle = `hsl(60deg, ${7000 / age + 50}%, 50%)`;
      for (let i = 0; i < WIDTH; i++) {
        c.fillRect(i, HEIGHT - ys[i], 1, HEIGHT);
        if (ys[i] > peak[i]) {
          peak[i] = ys[i];
        }
        ys[i] += dys[i];
        if (ys[i] > HEIGHT) {
          ys[i] = HEIGHT;
          dys[i] = 0;
        }
        dys[i] -= Math.random() * 0.04;
        if (prevWave && ys[i] < prevWave.ys[i]) {
          dys[i] = 0.004 * prevWave.dys[i] + 0.996 * dys[i];
        }
        if (dys[i] < -2) {
          dys[i] = -2;
        }
        if (ys[i] < -10) {
          dys[i] = 0;
        }
      }
      let newys = [];
      for (let i = 0; i < WIDTH; i++) {
        newys[i] = 0;
        let denom = 0;
        for (let j = Math.max(i - 20, 0); j < Math.min(i + 20, WIDTH); j++) {
          denom++;
          newys[i] += ys[j];
        }
        newys[i] /= denom;
      }
      wave.ys = newys;
      prevWave = wave;
    }
    if (frame % 400 == 0) {
      startWave();
      if (frame > 400 * 5) waves.shift();
    }
    handle = requestAnimationFrame(render);
  }

  let handle = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(handle);
  };
}
