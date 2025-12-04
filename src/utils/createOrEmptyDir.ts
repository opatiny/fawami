import { mkdir } from 'fs/promises';
import fsExtra from 'fs-extra';

export function createOrEmptyDir(path: string): void {
  // ensure outdir exists (sync)
  mkdir(path, { recursive: true }).catch((err) => {
    console.error('Error creating outdir:', err);
  });
  // empty output directory
  fsExtra.emptyDirSync(path);
}
