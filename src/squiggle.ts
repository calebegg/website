export function main(target: HTMLElement) {
  const width = innerWidth;
  const height = innerHeight;

  const svg = [
    `<svg width="${width}" height="${height}">`,
    `<rect x="0" y="0" width="${width}" height="${height /
      2}" fill="yellow" />`,
    `<rect x="0" y="${height / 2}" width="${width}" height="${height /
      2}" fill="magenta" />`,
  ];

  const AMPLITUDE = 75;

  for (let i = 0; i < width / 10 + 1; i++) {
    const x = i * 10;
    const color = i % 2 ? "yellow" : "magenta";
    const y2 = Math.random() * AMPLITUDE + height / 2;
    svg.push(`
      <line x1="${x}" x2="${x}"
          y1="${i % 2 ? 0 : height}"
          y2="${y2 - (i % 2 ? 0 : AMPLITUDE)}"
          stroke="${color}"
          stroke-width="10"
          stroke-linecap="round" />`);
  }

  svg.push("</svg>");
  target.insertAdjacentHTML("beforeend", svg.join(""));
}
