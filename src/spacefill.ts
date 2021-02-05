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
  c.lineWidth = 4;

  const badPixels: boolean[][] = Array.from({ length: innerWidth }, () => []);
  const circles = [
    {
      x: innerWidth / 2,
      y: innerHeight / 2,
      r: Math.min(innerWidth / 2, innerHeight / 2),
    },
  ];
  c.beginPath();
  c.arc(
    innerWidth / 2,
    innerHeight / 2,
    Math.min(innerWidth / 2, innerHeight / 2),
    0,
    Math.PI * 2,
  );
  c.stroke();
  function render() {
    let bestX = -1;
    let bestY = -1;
    let bestR = -1;
    for (let x = 0; x < innerWidth; x++) {
      outer: for (let y = 0; y < innerHeight; y++) {
        if (badPixels[x][y]) continue;
        let minDist = innerHeight + innerWidth;
        for (const c of circles) {
          const dist = Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2);
          if (dist < c.r) {
            badPixels[x][y] = true;
            continue outer;
          }
          minDist = Math.min(minDist, dist - c.r);
        }
        if (x + minDist > innerWidth) continue;
        if (x - minDist < 0) continue;
        if (y + minDist > innerHeight) continue;
        if (y - minDist < 0) continue;
        if (minDist > bestR) {
          bestX = x;
          bestY = y;
          bestR = minDist;
        }
      }
    }
    circles.push({ x: bestX, y: bestY, r: bestR });
    c.beginPath();
    c.arc(bestX, bestY, bestR, 0, Math.PI * 2);
    c.stroke();
    handle = requestAnimationFrame(render);
  }

  let handle = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(handle);
  };
}
