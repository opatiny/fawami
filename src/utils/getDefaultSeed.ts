/**
 * Default seed to use to generate random numbers with XSadd.
 * @returns A random integer
 */
export function getDefaultSeed(): number {
  return (Math.random() * 2 ** 32) >> 0;
}
