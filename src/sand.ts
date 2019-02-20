export function main() {
  const canvas = document.getElementsByTagName("canvas")[0];
  const c = canvas.getContext("2d")!;

  const DIM = 100;
  const RES = 500 / DIM;

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

  for (let r = 0; r < DIM; r++) {
    data.push([]);
    for (let c = 0; c < DIM; c++) {
      data[r][c] = State.AIR;
    }
  }

  const template =
    `
 XX   XX    X    XXXX XXX  XXXX    XX   XX
X  X X  X   X    X    X  X X      X  X X  X
X    X  X   X    X    XXX  X      X    X
X    XXXX   X    XXX  X  X XXX    X XX X XX
X  X X  X   X    X    X  X X      X  X X  X
 XX  X  X X XXXX XXXX XXX  XXXX X  XX   XX
` ||
    `
 ###    #       #     ##### ####  #####      ###   ###  
#   #  # #      #     #     #   # #         #   # #   # 
#     #   #     #     #     #   # #         #     #     
#     #   #     #     ###   ####  ###       #  ## #  ## 
#     ##### ### #     #     #   # #     ### #   # #   # 
#   # #   # ### #     #     #   # #     ### #   # #   # 
 ###  #   # ### ##### ##### ####  ##### ###  ###   ###  
`;

  for (const [y, row] of Array.from(template.split(/\n/).entries())) {
    for (const [x, c] of Array.from(Array.from(row).entries())) {
      data[2 * y + DIM / 2][2 * x + 6] = c !== " " ? State.WALL : State.AIR;
      data[2 * y + 1 + DIM / 2][2 * x + 6] = c !== " " ? State.WALL : State.AIR;
      data[2 * y + DIM / 2][2 * x + 7] = c !== " " ? State.WALL : State.AIR;
      data[2 * y + 1 + DIM / 2][2 * x + 7] = c !== " " ? State.WALL : State.AIR;
    }
  }

  let y = DIM - 30;
  for (let i = 0; i < 5; i++) {
    y += 5;
    let x = Math.floor(((Math.random() * 2 - 1) * DIM) / 4) + DIM / 2;
    for (let col = x; col < x + 15; col++) {
      data[y][col] = State.WALL;
    }
  }

  function sand() {
    return Math.floor(Math.random() * 4) / 4;
  }

  let fall = true;
  function addSand(e: MouseEvent) {
    if (!(e.buttons & 1)) return;
    fall = false;
    const col = Math.floor(e.clientX / RES);
    const row = Math.floor(e.clientY / RES);
    data[row][col] = State.AIR;
  }

  canvas.addEventListener("mousemove", addSand);
  canvas.addEventListener("mousedown", addSand);

  function render() {
    // Render
    for (let row = 0; row < DIM; row++) {
      for (let col = 0; col < DIM; col++) {
        c.fillStyle = COLOR_MAP.get(data[row][col])!;
        if (data[row][col] < 1 && data[row][col] > 0) {
          c.fillStyle = `hsl(300, ${data[row][col] * 40 + 60}%, 50%)`;
        }
        c.fillRect(col * RES, row * RES, RES, RES);
      }
    }
    // Update
    for (let offset = 0; offset < 4; offset++) {
      for (let row = Math.floor(offset / 2); row < DIM - 1; row += 2) {
        for (let col = offset % 2; col < DIM - 1; col += 2) {
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
    if (fall) {
      data[0][DIM / 2 + Math.floor(Math.random() * 25 - 12)] = sand();
      data[0][
        DIM / 2 + Math.floor((Math.random() * DIM) / 2 - DIM / 4)
      ] = sand();
      data[0][Math.floor(Math.random() * DIM)] = sand();
    }
    setTimeout(render, 300);
  }

  requestAnimationFrame(render);
}
