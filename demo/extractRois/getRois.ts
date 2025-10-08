import { join } from 'node:path';

import { colorRois, fromMask, read, write, writeSync } from 'image-js';

const filePath = '../../data/png/shapes-holes-25dpi.png';
const image = await read(join(import.meta.dirname, filePath));

const greyImage = image
  .fillAlpha(image.maxValue)
  .invert()
  .grey({ mergeAlpha: true });

await write(join(import.meta.dirname, 'image.png'), greyImage);

const mask = greyImage.threshold();

await write(join(import.meta.dirname, 'mask.png'), mask);

// get the ROIs

const roiMap = fromMask(mask);

const colorMap = colorRois(roiMap, { roiKind: 'white', mode: 'rainbow' });
await write(join(import.meta.dirname, 'colorMap.png'), colorMap);

const rois = roiMap.getRois();
console.log(`Found ${rois.length} ROIs`);

// save each ROI as a separate image
for (let i = 0; i < rois.length; i++) {
  const roi = rois[i];

  console.log(roi?.width, roi?.height, roi?.origin);

  const roiMask = roi.getMask();

  writeSync(join(import.meta.dirname, 'rois', `roi${i}.png`), roiMask);
}

// test rotating an ROI
const roi = rois[0];
const roiMask = roi.getMask();
