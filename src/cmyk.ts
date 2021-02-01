import { readFileSync } from "fs";

const css = readFileSync("src/cmyk.css", "utf8");

export function main(target: HTMLElement) {
  const style = document.createElement("style");
  style.textContent = css;
  target.appendChild(style);
  target.style.background = "white";
  for (const color of "CMYK".split("")) {
    const div = document.createElement("div");
    div.className = `color-dot ${color}`;
    target.appendChild(div);
  }
  return () => {};
}
