/**
 * Default seed to use to create random numbers with ml-random.
 * @returns A random integer
 */
export function getDefaultSeed(): number {
  return (Math.random() * 2 ** 32) >> 0;
}
