import { readFile } from 'node:fs/promises';

import type { RootNode } from 'svg-parser';
import { parse } from 'svg-parser';

export async function parseSvg(path: string): Promise<RootNode> {
  const svgContent = await readFile(path, 'utf8');
  const parsedSvg = parse(svgContent);
  return parsedSvg;
}
