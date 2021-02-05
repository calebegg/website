import { main as cmyk } from "./cmyk";
import { main as swarm } from "./swarm";
import { main as waves } from "./waves";
import { main as jpeg } from "./jpeg";
import { main as sand } from "./sand";
import { main as dithering } from "./dithering";
import { main as burnout } from "./burnout";
import { main as bubbles } from "./bubbles";
import { main as laser } from "./laser";
import { main as balls } from "./balls";
import { main as spacefill } from "./spacefill";
import { main as spacefill2 } from "./spacefill2";
import { main as rain } from "./rain";
import { main as blur } from "./blur";

interface WindowWithCancel extends Window {
  cancel: () => void;
}

const mains: { [k: string]: typeof cmyk } = {
  cmyk,
  swarm,
  waves,
  jpeg,
  sand,
  dithering,
  burnout,
  bubbles,
  laser,
  balls,
  spacefill,
  spacefill2,
  rain,
  blur,
};

function subjectivelyChoose<T>(array: T[]): T {
  const context: number[] = JSON.parse(
    localStorage.getItem("subjective_context") || "[]",
  );
  const possibilities = new Set(array.map((_, i) => i));
  for (const v of context) {
    possibilities.delete(v);
  }
  let index;
  if (possibilities.size > 0) {
    index = [...possibilities][Math.floor(Math.random() * possibilities.size)];
  } else {
    index = Math.floor(Math.random() * array.length);
  }
  context.unshift(index);
  localStorage.setItem(
    "subjective_context",
    JSON.stringify([index, ...context.slice(0, array.length - 2)]),
  );
  return array[index];
}

let picked = (target: HTMLElement) => () => {};

function pick() {
  picked =
    mains[location.hash.substr(1)] || subjectivelyChoose(Object.values(mains));
}

function main() {
  const wwc = (window as unknown) as WindowWithCancel;

  if (wwc.cancel) {
    wwc.cancel();
    document.getElementById("target")!.innerHTML = "";
  }

  wwc.cancel = picked(document.getElementById("target")!);
}

pick();
main();

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    pick();
    main();
  }
});

document.body.addEventListener("click", (e) => {
  if (e.target === document.body) {
    pick();
    main();
  }
});

addEventListener("hashchange", () => {
  pick();
  main();
});

let resizeTimeoutId: NodeJS.Timer;
function onResize() {
  clearTimeout(resizeTimeoutId);
  resizeTimeoutId = setTimeout(() => {
    document.body.classList.remove("with-scroll");
    document.body.classList.toggle(
      "with-scroll",
      innerHeight < document.body.scrollHeight,
    );
    main();
  }, 50);
}
addEventListener("resize", onResize);
onResize();
