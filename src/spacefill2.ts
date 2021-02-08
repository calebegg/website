const SPEED = 1;
const AGE_LIMIT = 2000;

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  target.appendChild(canvas);
  const c = canvas.getContext("2d")!;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = `${innerWidth}px`;
  c.scale(devicePixelRatio, devicePixelRatio);
  c.lineWidth = 4;

  let circles: Array<{
    x: number;
    y: number;
    r: number;
    done: boolean;
    hit?: unknown;
    age: number;
  }> = [];
  function render() {
    c.fillStyle = "yellow";
    c.fillRect(0, 0, innerWidth, innerHeight);
    if (circles.length === 0 || circles[0].done) {
      circles.unshift({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: -SPEED,
        done: false,
        age: 0,
      });
    }
    const curr = circles[0];
    curr.r += SPEED;
    for (const o of circles.slice(1)) {
      if (
        Math.sqrt((curr.x - o.x) ** 2 + (curr.y - o.y) ** 2) <=
        curr.r + o.r + 1
      ) {
        if (curr.r <= 0 || (curr.hit && curr.hit !== o)) {
          curr.r -= SPEED;
          curr.done = true;
        } else {
          curr.hit = o;
          const theta = Math.atan2(o.y - curr.y, o.x - curr.x);
          curr.x -= Math.cos(theta) * SPEED * 2;
          curr.y -= Math.sin(theta) * SPEED * 2;
        }
      }
    }
    if (curr.x + curr.r > innerWidth) {
      if (curr.hit && curr.hit !== "right-wall") {
        curr.done = true;
      } else {
        curr.hit = "right-wall";
        curr.x -= SPEED;
      }
    }
    if (curr.x - curr.r < 0) {
      if (curr.hit && curr.hit !== "left-wall") {
        curr.done = true;
      } else {
        curr.hit = "left-wall";
        curr.x += SPEED;
      }
    }
    if (curr.y + curr.r > innerHeight) {
      if (curr.hit && curr.hit !== "bottom-wall") {
        curr.done = true;
      } else {
        curr.hit = "bottom-wall";
        curr.y -= SPEED;
      }
    }
    if (curr.y - curr.r < 0) {
      if (curr.hit && curr.hit !== "top-wall") {
        curr.done = true;
      } else {
        curr.hit = "top-wall";
        curr.y += SPEED;
      }
    }
    if (curr.y + curr.r > innerHeight || curr.y - curr.r < 0) {
      curr.r -= SPEED;
      curr.done = true;
    }
    for (const [i, circle] of circles.slice(1).entries()) {
      circle.age++;
      if (circle.age > AGE_LIMIT) {
        circles.splice(i + 1, 1);
      }
    }
    circles = circles.filter((c) => c.r >= 0);
    for (const circle of circles) {
      c.strokeStyle = `rgba(255, 0, 255, ${1 - circle.age / AGE_LIMIT})`;
      c.beginPath();
      c.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
      c.stroke();
    }
    handle = requestAnimationFrame(render);
  }

  let handle = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(handle);
  };
}
