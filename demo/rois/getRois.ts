import { join } from 'node:path';

import { fromMask, read, write, writeSync } from 'image-js';

const filePath = '../../data/png/freesewing-aaron-100dpi.png';
const image = await read(join(import.meta.dirname, filePath));

const greyImage = image
  .fillAlpha(image.maxValue)
  .invert()
  .grey({ mergeAlpha: true });

await write(join(import.meta.dirname, 'image.png'), greyImage);

const mask = greyImage.threshold();

await write(join(import.meta.dirname, 'mask.png'), mask);

// get the ROIs
const rois = fromMask(mask).getRois();
console.log(`Found ${rois.length} ROIs`);

// save each ROI as a separate image
for (let i = 0; i < rois.length; i++) {
  const roi = rois[i];
  const roiMask = roi.getMask();

  writeSync(join(import.meta.dirname, `roi${i}.png`), roiMask);
}
