import type { Particle } from "../particle";
import { sleep, swapXY } from "../utils";

export default async function selectionSort(particles: Particle[]) {
  window.addEventListener("algo-kill", () => {
    particles = [];
  });

  const particlesLen = particles.length;
  if (!particlesLen) return;

  let lightestParticle: Particle | null = null;
  let index = 0;

  for (let i = 0; i < particlesLen; i++) {
    const particle = particles[i];
    particle?.cursor();
    if (!lightestParticle || particle?.lStar < lightestParticle?.lStar) {
      lightestParticle = particle;
      index = i;
    }
    await sleep(0);

    particle?.draw();
  }

  const particle = particles[0];
  if (particle) {
    particles[0] = lightestParticle!;
    particles[index] = particle;

    swapXY(particle, lightestParticle!)

    particle.draw();
    lightestParticle!.draw();

    selectionSort(particles.slice(1));
  }
}
