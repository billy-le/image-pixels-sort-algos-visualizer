import "reset-css";
import './style.css';
import sortingAlgos from "./sorting-algos.json";

let imageSrc: string | null = null;
const form = document.querySelector("form")!;
const select = document.querySelector("select")!;
const imageInput = document.querySelector('input[type="file"]')!;
const canvas = document.querySelector("canvas")!;
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext("2d")!;

sortingAlgos.forEach((algo) => {
  const option = document.createElement("option");
  option.value = algo.name;
  option.innerText = algo.name;
  option.disabled = algo.disabled;
  select.appendChild(option);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  console.log(formData);
});

function fitImageToCanvas(imageSrc: string) {
  const image = new Image();
  image.src = imageSrc;

  image.addEventListener('load', () => {
    const imgRatio = image.height / image.width;
    const winRatio = window.innerHeight / window.innerWidth;
    if (imgRatio < winRatio) {
      const h = window.innerWidth * imgRatio;
      ctx.drawImage(image, 0, (window.innerHeight - h) / 2, window.innerWidth, h);
    }
    if (imgRatio > winRatio) {
      const w = (window.innerWidth * winRatio) / imgRatio;
      ctx.drawImage(image, (window.innerWidth - w) / 2, 0, w, window.innerHeight);
    }
  })
}

imageInput.addEventListener("change", (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const [file] = Array.from((e.target as HTMLInputElement).files!);
  imageSrc = URL.createObjectURL(file);
  fitImageToCanvas(imageSrc);
});

// window.addEventListener("resize", () => {
//   canvas.width = innerWidth;
//   canvas.height = innerHeight;
// });
