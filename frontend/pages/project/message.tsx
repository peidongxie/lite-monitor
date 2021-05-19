import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { blue, red } from '@material-ui/core/colors';
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
    padding: theme.spacing(2, 5),
    margin: theme.spacing(8, 0, 0, 32),
    overflowX: 'hidden',
  },
  code: {
    padding: theme.spacing(2),
  },
  ip: {
    padding: theme.spacing(2),
  },
}));

const useMessageCode = (api: string) => {
  const { data, error } = useSWR<ErrorTrend>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const config: ChartConfiguration<'bar', number[], string> = {
  type: 'bar',
  data: {
    labels: ['', '', '', '', '', '', '', ''],
    datasets: [
      {
        label: '异常总数',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: red[500],
        backgroundColor: red[500] + '50',
        yAxisID: 'y0',
      },
      {
        label: '异常比例',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: blue[500],
        backgroundColor: blue[500] + '50',
        yAxisID: 'y1',
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
      y0: {
        min: 0,
        position: 'left',
        ticks: {
          precision: 0,
        },
      },
      y1: {
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
        position: 'right',
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (item) => {
            const label = `${item.dataset.label}: ${item.formattedValue}`;
            return item.datasetIndex === 1 ? label + '%' : label;
          },
        },
      },
    },
  },
};

const defaultData = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const defaultLabel = ['', '', '', '', '', '', '', ''];

const MessagePage: FC = () => {
  const locale = useLocale();
  const classes = useStyles();
  const menuItems = useMemo(
    () => [
      {
        name: 'error',
        type: 'error',
        showName: (locale === 'zhCN' && '错误监控') || 'Error Monitoring',
        link: '/project/error',
        selected: false,
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
        selected: true,
      },
    ],
    [locale],
  );
  const MessageCode = useMessageCode('/api/analysis/message/code');
  const data = MessageCode instanceof Object ? MessageCode.data : defaultData;
  const label =
    MessageCode instanceof Object ? MessageCode.label : defaultLabel;

  return (
    <Fragment>
      <SideDrawer items={menuItems} />
      <Container maxWidth={false} className={classes.root}>
        <Container maxWidth={false} className={classes.code}>
          <Typography variant={'h6'}>异常响应分析</Typography>
          <ChartBox config={config} data={data} label={label} />
        </Container>
        <Container maxWidth={false} className={classes.ip}>
          <Typography variant={'h6'}>异常登录地分析</Typography>
        </Container>
      </Container>
    </Fragment>
  );
};

export default MessagePage;
