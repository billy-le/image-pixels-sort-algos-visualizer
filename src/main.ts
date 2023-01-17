import "reset-css";
import "./style.css";
import sortingAlgos from "./sorting-algos.json";

let imageSrc: string | null = null;
let particles: Particle[] = [];
const form = document.querySelector("form")!;
const select = document.querySelector("select")!;
const imageInput = document.querySelector('input[type="file"]')!;
const canvas = document.querySelector("canvas")!;
canvas.width = innerWidth / 2;
canvas.height = innerHeight / 2;
const ctx = canvas.getContext("2d")!;

sortingAlgos.forEach((algo) => {
  const option = document.createElement("option");
  option.value = algo.script;
  option.innerText = algo.name;
  option.disabled = algo.disabled;
  select.appendChild(option);
});

/*
 * dictionary that is already sorted when we insert a new perceived lightness
 * but we want to use a visualizer to see how different sorting algos work
 */
const percievedLightness: { [key: number]: number[] } = {};

class Particle {
  public context: CanvasRenderingContext2D;
  public x: number;
  public y: number;
  public originX: number;
  public originY: number;
  public color: string;
  public lStar: number;
  constructor(context: CanvasRenderingContext2D, x: number, y: number, color: string, lStar: number) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.color = color;
    this.lStar = lStar;
  }
  draw() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, 1, 1);
  }
}

function sRGBtoLin(colorChannel: number) {
  // Send this function a decimal sRGB gamma encoded color value
  // between 0.0 and 1.0, and it returns a linearized value.

  if (colorChannel <= 0.04045) {
    return colorChannel / 12.92;
  } else {
    return Math.pow((colorChannel + 0.055) / 1.055, 2.4);
  }
}

function YtoLstar(Y: number) {
  // Send this function a percievedLightness value between 0.0 and 1.0,
  // and it returns L* which is "perceptual lightness"

  if (Y <= 216 / 24389) {
    // The CIE standard states 0.008856 but 216/24389 is the intent for 0.008856451679036
    return Y * (24389 / 27); // The CIE standard states 903.3, but 24389/27 is the intent, making 903.296296296296296
  } else {
    return Math.pow(Y, 1 / 3) * 116 - 16;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // const formData = new FormData(e.target as HTMLFormElement);
  // const sortAlgo = formData.get("sort")!;

  // const script = await import(`./module-${sortAlgo}`).then((res) => res.default);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
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

        particles.push(new Particle(ctx, x, y, `rgb(${red}, ${green}, ${blue})`, lStar));
      }
    }
  }

  for (const particle of particles) {
    particle.draw();
  }
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

imageInput.addEventListener("change", (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const [file] = Array.from((e.target as HTMLInputElement).files!);
  imageSrc = URL.createObjectURL(file);
  fitImageToCanvas(imageSrc);
});
