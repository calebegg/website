const RADIUS = 50;
const BLUR = 10;
const SPEED = 4;

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  target.appendChild(canvas);
  const c = canvas.getContext("2d")!;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = `${innerWidth}px`;
  c.scale(devicePixelRatio, devicePixelRatio);

  c.filter = `blur(${BLUR}px)`;
  c.fillStyle = "yellow";
  c.fillRect(0, 0, innerWidth, innerHeight);
  c.fillStyle = "magenta";
  c.fillRect(0, innerHeight / 2, innerWidth, innerHeight);

  let mX = 0;
  let mY = -RADIUS;
  let yX = 0;
  let yY = innerHeight + RADIUS;

  function render() {
    c.drawImage(canvas, 0, 0, innerWidth, innerHeight);
    c.fillStyle = "magenta";
    // c.fillRect(0, innerHeight - 1, innerWidth, innerHeight);
    if (mY <= -RADIUS && Math.random() < 0.1) {
      mX = Math.random() * innerWidth;
      mY = innerHeight + RADIUS;
    }
    mY -= SPEED;
    c.beginPath();
    c.arc(mX, mY, RADIUS, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = "yellow";
    // c.fillRect(0, 0, innerWidth, 1);
    if (yY >= innerHeight + RADIUS && Math.random() < 0.1) {
      yX = Math.random() * innerWidth;
      yY = -RADIUS;
    }
    yY += SPEED;
    c.beginPath();
    c.arc(yX, yY, RADIUS, 0, Math.PI * 2);
    c.fill();

    handle = requestAnimationFrame(render);
  }

  let handle = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(handle);
  };
}
