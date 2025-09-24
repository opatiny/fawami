import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { RootNode } from 'svg-parser';
import { parse } from 'svg-parser';

export async function parseSvg(path: string): Promise<RootNode> {
  const svgPath = join(__dirname, path);

  const svgContent = await readFile(svgPath, 'utf8');
  const parsedSvg = parse(svgContent);
  return parsedSvg;
}
