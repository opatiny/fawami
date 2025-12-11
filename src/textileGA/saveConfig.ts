import fs from 'fs/promises';
import { join } from 'node:path';

import type { TextileGA } from './TextileGA.ts';

export interface SaveConfigOptions {
  /**
   * Path to the folder where to save the configuration file
   * @default textilGA.outdir
   */
  outdir?: string;

  /**
   * Name of the configuration file
   * @default 'config.json'
   */
  fileName?: string;
  debug?: boolean;
}

/**
 * Save all relevant configuration of the TextileGA instance to a JSON file.
 * @param textileGA - The class instance to save
 * @param options - Options
 */
export async function saveConfig(
  textileGA: TextileGA,
  options: SaveConfigOptions = {},
): Promise<void> {
  const {
    outdir = textileGA.outdir as string,
    fileName = 'config.json',
    debug = false,
  } = options;

  if (debug) {
    console.log('Saving config to', join(outdir, fileName));
  }

  const data = {
    seed: textileGA.seed,
    fitnessWeights: textileGA.fitnessWeights,
    mutateOptions: textileGA.mutateOptions,
    crossoverOptions: textileGA.crossoverOptions,
    optionsGA: textileGA.ga.options,
    // fabric: textileGA.fabric.,
    // patternPieces: textileGA.patternPieces,
  };
  const optionsJson = JSON.stringify(data, null, 2);
  await fs.writeFile(join(outdir, fileName), optionsJson, 'utf-8');
}
