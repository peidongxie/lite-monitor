import Box from '@mui/material/Box';
import {
  Chart,
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  ChartType,
  DefaultDataPoint,
} from 'chart.js';
import 'chart.js/auto';
import { PropsWithChildren, ReactElement, useEffect, useRef } from 'react';

interface ChartBoxProps<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
> {
  config: ChartConfiguration<TType, TData, TLabel>;
  data: TData[];
  datasets: ChartDataset<TType, TData>[];
  labels: TLabel[];
  options: ChartOptions<TType>;
}

const ChartBox = <
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
>(
  props: PropsWithChildren<ChartBoxProps<TType, TData, TLabel>>,
): ReactElement => {
  const { config, data, datasets, labels, options } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<TType, TData, TLabel>>();

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) return;
    chartRef.current = new Chart(canvasRef.current, {
      ...config,
      data: {
        datasets: datasets.map((dataset, index) => ({
          ...dataset,
          data: data[index],
        })),
        labels: labels,
      },
      options: options,
    });
  }, [config, data, datasets, labels, options]);
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.data = {
      datasets: datasets.map((dataset, index) => ({
        ...dataset,
        data: data[index],
      })),
      labels: labels,
    };
    chart.options = options;
    chart.update();
  }, [data, datasets, labels, options]);

  return (
    <Box position={'relative'} width={'100%'}>
      <canvas ref={canvasRef} />
    </Box>
  );
};

export default ChartBox;
