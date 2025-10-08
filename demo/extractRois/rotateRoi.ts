import { join } from 'node:path';

import { read } from 'image-js';

const filePath = './extractRois/rois/roi0.png';

const image = await read(join(import.meta.dirname, filePath));
