import * as echarts from 'echarts';
import { Matrix } from 'ml-matrix';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { dark } from './heatMapColors.ts';

export interface PlotHeatMapOptions {
  /**
   * Path to save the SVG file.
   * @default import.meta.dirname
   */
  path?: string;
  /**
   * Name of the plot file.
   * @default 'heatmap.svg'
   */
  name?: string;
  /**
   * Whether to output debug information.
   * @default false
   */
  debug?: boolean;
  /**
   * Number of colors in the heatmap.
   * @default 8
   */
  nbColors?: number;
}

export function plotHeatMap(
  matrix: Matrix,
  options: PlotHeatMapOptions = {},
): void {
  const {
    path = import.meta.dirname,
    name = 'heatmap.svg',
    debug = false,
    nbColors = 8,
  } = options;

  if (nbColors > 10) {
    throw new Error('plotHeatMap: nbColors greater than 10 is not supported.');
  }

  // Create chart instance (headless)
  const chart = echarts.init(null, null, {
    renderer: 'svg', // use SVG renderer
    ssr: true, // enable server-side rendering mode
    width: 800,
    height: 600,
  });

  console.log(matrix.to2DArray());

  const option = {
    tooltip: {},
    grid: {
      right: 140,
      left: 40,
    },
    xAxis: {
      type: 'category',
      //data: Array.from({ length: matrix.columns }, (_, i) => i.toString()),
    },
    yAxis: {
      type: 'category',
      //data: Array.from({ length: matrix.rows }, (_, i) => i.toString()),
    },
    visualMap: {
      type: 'piecewise',
      min: 0,
      max: Math.ceil(matrix.max()),
      left: 'right',
      top: 'center',
      calculable: true,
      realtime: false,
      splitNumber: nbColors,
      inRange: {
        color: dark,
      },
    },
    series: [
      {
        name: 'Gaussian',
        type: 'heatmap',
        data: matrix,
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          },
        },
        progressive: 1000,
        animation: false,
      },
    ],
  };

  chart.setOption(option);

  const svg = chart.renderToSVGString();
  writeFileSync(join(path, name), svg, 'utf-8');
  if (debug) {
    console.log('SVG saved successfully!');
  }
  chart.dispose();
}
