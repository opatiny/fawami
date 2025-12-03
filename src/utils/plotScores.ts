import * as echarts from 'echarts';
import { writeFileSync } from 'fs';
import { join } from 'path';

export interface PlotScoresOptions {
  /**
   * Path to save the SVG file.
   * @default import.meta.dirname
   */
  path?: string;
  /**
   * Name of the plot file.
   * @default 'scatter.svg'
   */
  name?: string;
  /**
   * Whether to output debug information.
   * @default false
   */
  debug?: boolean;
}

export function plotScores(
  scores: number[],
  options: PlotScoresOptions = {},
): void {
  const {
    path = import.meta.dirname,
    name = 'scatter.svg',
    debug = false,
  } = options;

  // Create chart instance (headless)
  const chart = echarts.init(null, null, {
    renderer: 'svg', // use SVG renderer
    ssr: true, // enable server-side rendering mode
    width: 800,
    height: 600,
  });

  console.log('Plotting scores:', scores);

  const xData = scores.map((_, index) => index + 1);
  console.log('X data:', xData);

  const option = {
    animation: false,
    backgroundColor: '#ffffff',
    grid: { left: 60, right: 60, top: 60, bottom: 60 },
    xAxis: {
      type: 'category',
      data: xData,
      name: 'Iteration',
    },
    yAxis: {
      //type: 'value',
      name: 'Score',
    },
    series: [
      {
        data: scores,
        type: 'line',
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
