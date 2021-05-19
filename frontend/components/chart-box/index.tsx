import Box from '@material-ui/core/Box';
import {
  Chart,
  ChartType,
  ChartConfiguration,
  DefaultDataPoint,
} from 'chart.js';
import 'chart.js/auto';
import { PropsWithChildren, useEffect, useRef } from 'react';

interface ChartBoxProps<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
> {
  config: ChartConfiguration<TType, TData, TLabel>;
  data: TData[];
  label: TLabel[];
}

const ChartBox = <
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
>(
  props: PropsWithChildren<ChartBoxProps<TType, TData, TLabel>>,
) => {
  const { config, data, label } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef<ChartConfiguration<TType, TData, TLabel>>(config);
  const chartRef = useRef<Chart<TType, TData, TLabel>>();

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current = new Chart(canvasRef.current, configRef.current);
  }, []);
  useEffect(() => {
    if (!chartRef.current) return;
    const newData = chartRef.current.data;
    newData.labels = label;
    newData.datasets = newData.datasets.map((dataset, index) => ({
      ...dataset,
      data: data[index],
    }));
    chartRef.current.update();
  }, [data, label]);

  return (
    <Box position={'relative'} width={'100%'}>
      <canvas ref={canvasRef} />
    </Box>
  );
};

export default ChartBox;
