import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { blue, green, red, yellow } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { ChartConfiguration } from 'chart.js';
import { FC, Fragment, useMemo } from 'react';
import useSWR from 'swr';
import ChartBox from '../../components/chart-box';
import SideDrawer from '../../components/side-drawer';
import { jsonFetcher } from '../../utils/fetcher';
import { useLocale } from '../../utils/locale';

interface ResourceCluster {
  data: number[][];
  label: string[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 5),
    margin: theme.spacing(8, 0, 0, 32),
    overflowX: 'hidden',
  },
  cluster: {
    padding: theme.spacing(2),
  },
  docker: {
    padding: theme.spacing(2),
  },
}));

const useErrorTrend = (api: string) => {
  const { data, error } = useSWR<ResourceCluster>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};
const config: ChartConfiguration<'line', number[], string> = {
  type: 'line',
  data: {
    labels: ['', '', '', '', '', '', '', '', '', ''],
    datasets: [
      {
        label: '节点创建',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: green[500],
        backgroundColor: green[500] + '50',
        cubicInterpolationMode: 'monotone',
        fill: false,
      },
      {
        label: '节点启动',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: blue[500],
        backgroundColor: blue[500] + '50',
        cubicInterpolationMode: 'monotone',
        fill: false,
      },
      {
        label: '节点停止',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: yellow[500],
        backgroundColor: yellow[500] + '50',
        cubicInterpolationMode: 'monotone',
        fill: false,
      },
      {
        label: '节点销毁',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: red[500],
        backgroundColor: red[500] + '50',
        cubicInterpolationMode: 'monotone',
        fill: false,
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
      },
    },
  },
};

const defaultData = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const defaultLabel = ['', '', '', '', '', '', '', '', '', ''];

const ResourcePage: FC = () => {
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
        selected: true,
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
  const errorTrend = useErrorTrend('/api/analysis/resource/cluster');
  const data = errorTrend instanceof Object ? errorTrend.data : defaultData;
  const label = errorTrend instanceof Object ? errorTrend.label : defaultLabel;

  return (
    <Fragment>
      <SideDrawer items={menuItems} />
      <Container maxWidth={false} className={classes.root}>
        <Container maxWidth={false} className={classes.cluster}>
          <Typography variant={'h6'}>集群节点分析</Typography>
          <ChartBox config={config} data={data} label={label} />
        </Container>
        <Container maxWidth={false} className={classes.docker}>
          <Typography variant={'h6'}>数据库容器分析</Typography>
        </Container>
      </Container>
    </Fragment>
  );
};

export default ResourcePage;
