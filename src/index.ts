import { main as cmyk } from "./cmyk";
import { main as squiggle } from "./squiggle";
import { main as swarm } from "./swarm";
import { main as waves } from "./waves";
import { main as jpeg } from "./jpeg";
import { main as sand } from "./sand";
import { main as dithering } from "./dithering";
import { main as burnout } from "./burnout";

const mains: { [k: string]: typeof cmyk } = {
  cmyk,
  squiggle,
  swarm,
  waves,
  jpeg,
  sand,
  dithering,
  burnout,
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

(mains[location.hash.substr(1)] || subjectivelyChoose(Object.values(mains)))(
  document.getElementById("target")!,
);
