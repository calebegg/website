const EMOJI = "😀,😃,😄,😁,😆,😅,😂,🤣,🥲,😊,😇,🙂,🙃,😉,😌,😍,🥰,😘,😗,😙,😚,😋,😛,😝,😜,🤪,🤨,🧐,🤓,😎,🥸,🤩,🥳,😏,😒,😞,😔,😟,😕,🙁,☹️,😣,😖,😫,😩,🥺,😢,😭,😤,😠,😡,🤬,🤯,😳,🥵,🥶,😱,😨,😰,😥,😓,🤗,🤔,🤭,🤫,🤥,😶,😐,😑,😬,🙄,😯,😦,😧,😮,😲,🥱,😴,🤤,😪,😵,🤐,🥴,🤢,🤮,🤧,😷,🤒,🤕,🤑,🤠,😈,👿,👹,👺,🤡,💩,👻,💀,☠️,👽,👾,🤖,🎃,😺,😸,😹,😻,😼,😽,🙀,😿,😾".split(
  ",",
);

const FONT_SIZE = 20;

interface Particle {
  value: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  theta: number;
  dtheta: number;
}

export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  const dpr = devicePixelRatio || 1;
  const w = (canvas.width = innerWidth * dpr);
  const h = (canvas.height = innerHeight * dpr);
  const c = canvas.getContext("2d")!;
  c.scale(1 / dpr, 1 / dpr);
  c.font = `${FONT_SIZE}px sans-serif`;
  c.textAlign = "center";
  target.appendChild(canvas);
  const particles: Particle[] = [];

  let handle = -1;
  function render() {
    c.fillStyle = "rgba(255, 255, 0, .1)";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "black";
    const v = Math.PI * 2 * Math.random();
    if (particles.length < 1000) {
      particles.push({
        value: EMOJI[Math.floor(Math.random() * EMOJI.length)],
        x: w / 2,
        y: h / 2,
        dx: Math.sin(v) * 4,
        dy: Math.cos(v) * 4,
        theta: 0,
        dtheta: 0.1 * Math.random(),
      });
    }
    for (const [i, p] of particles.entries()) {
      p.dx += (Math.random() - 0.5) / 2;
      p.dy += (Math.random() - 0.5) / 2;
      p.x += p.dx;
      p.y += p.dy;
      p.theta += p.dtheta;
      if (p.x < -500 || p.x > w + 500 || p.y < -500 || p.y > h + 500) {
        particles.splice(i, 1);
      }
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.theta);
      c.fillText(p.value, 0, FONT_SIZE / 2);
      c.restore();
    }
    handle = requestAnimationFrame(render);
  }
  render();
  return () => {
    cancelAnimationFrame(handle);
  };
}
