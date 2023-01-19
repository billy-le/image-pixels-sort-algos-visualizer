import "reset-css";
import "./style.css";
import sortingAlgos from "./sorting-algos.json";
import { Particle } from "./particle";
import { sRGBtoLin, YtoLstar } from "./utils";

/*
 * dictionary that is already sorted when we insert a new perceived lightness
 * but we want to use a visualizer to see how different sorting algos work
 */
const percievedLightness: { [key: number]: number[] } = {};

let running = false;
let imageSrc: string | null = null;
let particles: Particle[] = [];
const size = 40;
const form = document.querySelector("form")!;
const submit = form.querySelector('button[type="submit"]') as HTMLButtonElement;
const select = document.querySelector("select")!;
const imageInput = document.querySelector('input[type="file"]')!;
const canvas = document.querySelector("canvas")!;
canvas.width = 400;
canvas.height = 400;
const ctx = canvas.getContext("2d")!;
ctx.imageSmoothingEnabled = false;

sortingAlgos.forEach((algo) => {
  const option = document.createElement("option");
  option.value = algo.script;
  option.innerText = algo.name;
  option.disabled = algo.disabled;
  select.appendChild(option);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (running) return;
  running = true;
  submit.disabled = running;
  const formData = new FormData(form);
  const algoFileName = formData.get("sort")!;
  const sortAlgo = await import(`./module-${algoFileName}.ts`).then((res) => res.default);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += size) {
    for (let x = 0; x < canvas.width; x += size) {
      const index = (x + y * imageData.width) * 4;

      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];

      if (alpha) {
        // https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color
        const vR = red / 255;
        const vG = green / 255;
        const vB = blue / 255;

        const Y = sRGBtoLin(vR) * 0.2126 + sRGBtoLin(vG) * 0.7152 + sRGBtoLin(vB) * 0.0722;

        const lStar = YtoLstar(Y);

        if (!percievedLightness[lStar]) {
          percievedLightness[lStar] = [red, green, blue];
        }
        particles.push(new Particle({ context: ctx, x, y, color: `rgb(${red}, ${green}, ${blue})`, size, lStar }));
      }
    }
  }

  for (const particle of particles) {
    particle.draw();
  }

  sortAlgo(particles);
});

function fitImageToCanvas(imageSrc: string) {
  const image = new Image();
  image.src = imageSrc;

  image.addEventListener("load", () => {
    const imgRatio = image.height / image.width;
    const canvasRatio = canvas.height / canvas.width;
    if (imgRatio < canvasRatio) {
      const h = canvas.width * imgRatio;
      ctx.drawImage(image, 0, (canvas.height - h) / 2, canvas.width, h);
    }
    if (imgRatio > canvasRatio) {
      const w = (canvas.width * canvasRatio) / imgRatio;
      ctx.drawImage(image, (canvas.width - w) / 2, 0, w, canvas.height);
    }
  });
}

function emitKillEvent() {
  window.dispatchEvent(new Event("kill"));
  running = false;
  submit.disabled = running;
}

imageInput.addEventListener("change", (e) => {
  emitKillEvent();
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const [file] = Array.from((e.target as HTMLInputElement).files!);
  imageSrc = URL.createObjectURL(file);
  fitImageToCanvas(imageSrc);
});
