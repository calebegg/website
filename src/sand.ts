export function main(target: HTMLElement) {
  const canvas = document.createElement("canvas");
  canvas.width = innerWidth * 2;
  canvas.height = innerHeight * 2;
  canvas.style.width = `${innerWidth}px`;
  target.appendChild(canvas);
  const c = canvas.getContext("2d")!;
  c.scale(2, 2);

  const RES = Math.floor(innerWidth / 150);
  const WIDTH = Math.floor(innerWidth / RES) + 1;
  const HEIGHT = Math.floor(innerHeight / RES) + 1;
  c.translate(((innerWidth % RES) - RES) / 2, (innerHeight % RES) - RES);

  enum State {
    AIR,
    SAND,
    WALL,
  }

  const CHAR_MAP = new Map([
    ["S", State.SAND],
    ["A", State.AIR],
    ["W", State.WALL],
  ]);

  const COLOR_MAP = new Map([
    [State.SAND, "magenta"],
    [State.AIR, "yellow"],
    [State.WALL, "black"],
  ]);
  const OFFSETS = [[0, 0], [0, 1], [1, 0], [1, 1]];

  const data: (State | number)[][] = [];

  const transitions = [
    // Sand
    ["1*/A*", "A*/1*"],
    ["*1/*A", "*A/*1"],
    ["1A/2A", "AA/21"],
    ["A1/A2", "AA/12"],
    ["1A/WA", "AA/W1"],
    ["A1/AW", "AA/1W"],
  ];

  for (let r = 0; r < HEIGHT; r++) {
    data.push([]);
    for (let c = 0; c < WIDTH; c++) {
      data[r][c] = State.AIR;
    }
  }

  for (let y = 30; y < HEIGHT; y += 4) {
    const width = Math.floor(Math.random() * 10) + 10;
    let x = Math.floor(Math.random() * (WIDTH - width));
    for (let col = x; col < x + width; col++) {
      data[y][col] = State.WALL;
    }
  }

  function sand() {
    return Math.floor(Math.random() * 4) / 4;
  }

  function render() {
    // Render
    for (let row = 0; row < HEIGHT; row++) {
      for (let col = 0; col < WIDTH; col++) {
        c.fillStyle = COLOR_MAP.get(data[row][col])!;
        if (data[row][col] < 1 && data[row][col] > 0) {
          c.fillStyle = `hsl(300, ${data[row][col] * 40 + 60}%, 50%)`;
        }
        c.fillRect(col * RES, row * RES, RES, RES);
      }
    }
    // Update
    for (let offset = 0; offset < 4; offset++) {
      for (let row = Math.floor(offset / 2); row < HEIGHT - 1; row += 2) {
        for (let col = offset % 2; col < WIDTH - 1; col += 2) {
          for (const [before, after] of transitions) {
            const sands: number[] = [];
            if (
              OFFSETS.every(([rowOff, colOff]) => {
                const char = before
                  .replace(/\//g, "")
                  .charAt(colOff + rowOff * 2);
                let datum = data[row + rowOff][col + colOff];
                if (datum > 0 && datum < 1) {
                  if (char.match(/\d/)) {
                    sands[+char] = datum;
                    return true;
                  } else {
                    return char === "*";
                  }
                }
                return char === "*" || char === State[datum].charAt(0);
              })
            ) {
              for (const [rowOff, colOff] of OFFSETS) {
                const char = after
                  .replace(/\//g, "")
                  .charAt(colOff + rowOff * 2);
                if (char === "*") continue;
                if (char.match(/\d/)) {
                  data[row + rowOff][col + colOff] = sands[+char];
                } else {
                  data[row + rowOff][col + colOff] = CHAR_MAP.get(char)!;
                }
              }
              break;
            }
          }
        }
      }
    }
    data[0][WIDTH / 2 + Math.floor(Math.random() * 25 - 12)] = sand();
    data[0][
      WIDTH / 2 + Math.floor((Math.random() * WIDTH) / 2 - WIDTH / 4)
    ] = sand();
    data[0][Math.floor(Math.random() * WIDTH)] = sand();
    handle = setTimeout(render, 60);
  }

  let handle = setTimeout(render, 0);

  return () => {
    clearTimeout(handle);
  };
}
