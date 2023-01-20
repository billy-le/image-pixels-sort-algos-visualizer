import { Particle } from "../particle";
import { sleep } from "../utils";

export default async function insertionSort(particles: Particle[]) {
  window.addEventListener("algo-kill", () => {
    particles = [];
  });

  const particlesLen = particles.length;
  if (!particlesLen) return;

  let sortCount = 0;

  for (let i = 0; i < particlesLen; ) {
    const particle = particles[i];
    const nextParticle = particles[i + 1];

    particle?.cursor();
    nextParticle?.cursor();
    if (nextParticle?.lStar < particle?.lStar) {
      particles[i] = nextParticle;
      particles[i + 1] = particle;

      const x = particle.x;
      const y = particle.y;
      particle.x = nextParticle.x;
      particle.y = nextParticle.y;
      nextParticle.x = x;
      nextParticle.y = y;

      sortCount++;
      i = i > 0 ? i - 1 : i;
    } else {
      i++;
    }

    await sleep(0);
    particle?.draw();
    nextParticle?.draw();
  }
  if (sortCount) {
    insertionSort(particles);
  }
}
