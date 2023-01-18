import { Particle } from "./particle";

import { sleep } from "./utils";

export default async function selectionSort(particles: Particle[]) {
  const particlesLen = particles.length;
  if (!particlesLen) return;

  let lowest: Particle | null = null;
  let index = 0;

  for (let i = 0; i < particlesLen; i++) {
    const particle = particles[i];
    particle.remove();
    if (!lowest || particle.lStar < lowest?.lStar) {
      lowest = particle;
      index = i;
    }
    await sleep(0);
    particle.draw();
  }

  const particle = particles[0];
  const x = particle.x;
  const y = particle.y;
  const lStar = particle.lStar;
  particle.x = lowest!.x;
  particle.y = lowest!.y;
  particle.lStar = lowest!.lStar;

  lowest!.x = x;
  lowest!.y = y;
  lowest!.lStar = lStar;

  particles[0] = lowest!;
  particles[index] = particle;

  particle.draw();
  lowest!.draw();

  selectionSort(particles.slice(1));
}
