import type { Particle } from "../particle";
import { sleep, swapXY } from "../utils";

export default async function bubbleSort(particles: Particle[]) {
  window.addEventListener("algo-kill", () => {
    particles = [];
  });

  const particlesLen = particles.length;
  if (!particlesLen) return;

  let sortCount = 0;

  for (let i = 0; i < particlesLen; i++) {
    const particle = particles[i];
    const nextParticle = particles[i + 1];

    particle?.cursor();
    nextParticle?.cursor();
    if (nextParticle?.lStar < particle?.lStar) {
      particles[i] = nextParticle;
      particles[i + 1] = particle;

      swapXY(particle, nextParticle)
    
      sortCount++;
    }
    await sleep(0);
    particle?.draw();
    nextParticle?.draw();
  }
  if (sortCount) {
    bubbleSort(particles.slice(0, -1));
  }
}
