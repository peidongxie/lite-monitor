import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ChartConfiguration } from 'chart.js';
import { FC, Fragment, useMemo } from 'react';
import useSWR from 'swr';
import ChartBox from '../../components/chart-box';
import SideDrawer from '../../components/side-drawer';
import { jsonFetcher } from '../../utils/fetcher';
import { useLocale } from '../../utils/locale';

interface ErrorTrend {
  data: number[][];
  label: string[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(5),
    margin: theme.spacing(8, 0, 0, 32),
    overflowX: 'hidden',
  },
  trend: {
    padding: theme.spacing(2),
  },
  detail: {
    padding: theme.spacing(2),
  },
}));

const useErrorTrend = (api: string) => {
  const { data, error } = useSWR<ErrorTrend>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};
const config: ChartConfiguration<'line', number[], string> = {
  type: 'line',
  data: {
    labels: ['', '', '', '', '', '', '', '', '', ''],
    datasets: [
      {
        label: '错误总数',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 50)',
        cubicInterpolationMode: 'monotone',
        fill: false,
      },
      {
        label: '影响人数',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 50)',
        cubicInterpolationMode: 'monotone',
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      y: {
        min: 0,
        ticks: {
          precision: 1,
        },
      },
    },
  },
};

const defaultData = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const defaultLabel = ['', '', '', '', '', '', '', '', '', ''];

const ErrorPage: FC = () => {
  const locale = useLocale();
  const classes = useStyles();
  const menuItems = useMemo(
    () => [
      {
        name: 'error',
        type: 'error',
        showName: (locale === 'zhCN' && '错误监控') || 'Error Monitoring',
        link: '/project/error',
        selected: true,
      },
      {
        name: 'resource',
        type: 'resource',
        showName: (locale === 'zhCN' && '资源监控') || 'Resource Monitoring',
        link: '/project/resource',
        selected: false,
      },
      {
        name: 'message',
        type: 'message',
        showName: (locale === 'zhCN' && '报文监控') || 'Message Monitoring',
        link: '/project/message',
        selected: false,
      },
    ],
    [locale],
  );
  const errorTrend = useErrorTrend('/api/analysis/error/trend');
  const data = errorTrend instanceof Object ? errorTrend.data : defaultData;
  const label = errorTrend instanceof Object ? errorTrend.label : defaultLabel;

  return (
    <Fragment>
      <SideDrawer items={menuItems} />
      <Container maxWidth={false} className={classes.root}>
        <Container maxWidth={false} className={classes.trend}>
          <Typography variant={'h6'}>错误趋势分析</Typography>
          <ChartBox config={config} data={data} label={label} />
        </Container>
        <Container maxWidth={false} className={classes.detail}>
          <Typography variant={'h6'}>错误详情分析</Typography>
        </Container>
      </Container>
    </Fragment>
  );
};

export default ErrorPage;
