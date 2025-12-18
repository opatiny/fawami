import * as echarts from 'echarts';
import { Matrix } from 'ml-matrix';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { dark } from './heatMapColors.ts';
import { get } from 'node:http';

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
    height: 800,
  });

  const formattedData = getHeatMapData(matrix);

  const option = {
    animation: false,
    tooltip: {},
    grid: {
      right: 140,
      left: 40,
    },
    xAxis: {
      type: 'category',
      data: formattedData.xData,
    },
    yAxis: {
      type: 'category',
      data: formattedData.yData,
    },
    visualMap: {
      type: 'piecewise',
      min: 0,
      max: Math.ceil(matrix.max() * 10) / 10,
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
        type: 'heatmap',
        data: formattedData.data,
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          },
        },
        progressive: 0,
      },
    ],
  };

  chart.setOption(option);

  const svg = chart.renderToSVGString();
  writeFileSync(join(path, name), svg, 'utf-8');
  if (debug) {
    console.log('Heatmap saved successfully!');
  }
  chart.dispose();
}

function getHeatMapData(matrix: Matrix): {
  data: Array<[number, number, number]>;
  yData: number[];
  xData: number[];
} {
  const data: Array<[number, number, number]> = [];
  const yData: number[] = [];
  const xData: number[] = [];
  for (let i = 0; i < matrix.rows; i++) {
    yData.push(matrix.rows - i - 1);
    for (let j = 0; j < matrix.columns; j++) {
      data.push([j, matrix.rows - i - 1, matrix.get(i, j)]);
    }
  }
  for (let j = 0; j < matrix.columns; j++) {
    xData.push(j);
  }

  return { data, yData, xData };
}
