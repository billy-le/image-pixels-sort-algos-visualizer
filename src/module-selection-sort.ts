import { Particle } from "./particle";

import { sleep } from "./utils";

export default async function selectionSort(particles: Particle[]) {
  const particlesLen = particles.length;
  if (!particlesLen) return;

  let lowestLstar: Particle | null = null;
  let index = 0;

  for (let i = 0; i < particlesLen; i++) {
    const particle = particles[i];
    particle.remove();
    if (!lowestLstar || particle.lStar < lowestLstar.lStar) {
      lowestLstar = particle;
      index = i;
    }
    await sleep(0);
    particle.draw();
  }

  const particle = particles[0];

  particles[0] = lowestLstar!;
  particles[index] = particle;

  const x = particle.x;
  const y = particle.y;

  particle.x = lowestLstar!.x;
  particle.y = lowestLstar!.y;

  lowestLstar!.x = x;
  lowestLstar!.y = y;

  particle.draw();
  lowestLstar!.draw();

  selectionSort(particles.slice(1));
}
