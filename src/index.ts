import { main as cmyk } from "./cmyk";
import { main as squiggle } from "./squiggle";
import { main as swarm } from "./swarm";
import { main as waves } from "./waves";

const mains = [cmyk, squiggle, swarm, waves];

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
    JSON.stringify([index, ...context.slice(0, array.length - 1)]),
  );
  return array[index];
}

document.getElementById("target")!.innerHTML = "";
subjectivelyChoose(mains)(document.getElementById("target")!);

const details = document.getElementsByTagName("details")[0];
details.style.width = `${details.clientWidth}px`;
