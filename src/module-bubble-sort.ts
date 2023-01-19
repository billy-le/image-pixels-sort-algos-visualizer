import { Particle } from "./particle";
import { sleep } from "./utils";

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
    if (particle && nextParticle) {
      particle.remove();
      nextParticle.remove();
      if (nextParticle.lStar < particle.lStar) {
        particles[i] = nextParticle;
        particles[i + 1] = particle;
        const x = particle.x;
        const y = particle.y;

        particle.x = nextParticle.x;
        particle.y = nextParticle.y;
        nextParticle.x = x;
        nextParticle.y = y;

        sortCount++;
      }
      await sleep(0);
      particle.draw();
      nextParticle.draw();
    }
  }
  if (sortCount) {
    bubbleSort(particles.slice(0, -1))
  }
}
