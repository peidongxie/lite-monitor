import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { blue, green, grey, red, yellow } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';
import { FC, Fragment, useMemo } from 'react';
import useSWR from 'swr';
import ChartBox from '../../components/chart-box';
import CollapsibleTable from '../../components/collapsible-table';
import SideDrawer from '../../components/side-drawer';
import { jsonFetcher } from '../../utils/fetcher';
import { useLocale } from '../../utils/locale';
import { useName } from '../../utils/router';
import { format } from '../../utils/time';

interface ResourceCluster {
  data: number[][];
  labels: string[];
}

interface ResourceDockerItem {
  uid: string;
  timestamp: number;
  action: number;
  count: number;
  items: {
    timestamp: number;
    core: number;
    memory: number;
    platformVersion: string;
    action: number;
    payload: string;
  }[];
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

const useResourceCluster = (api: string) => {
  const { data, error } = useSWR<ResourceCluster>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const config: ChartConfiguration<'line', number[], string> = {
  type: 'line',
  data: {
    labels: [],
    datasets: [],
  },
};

const useData = (api: string): number[][] => {
  const name = useName();
  const resourceCluster = useResourceCluster(`${api}?name=${name}`);
  return resourceCluster instanceof Object
    ? resourceCluster.data
    : [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
};

const useDatasets = (): ChartDataset<'line', number[]>[] => {
  const locale = useLocale();
  return useMemo<ChartDataset<'line', number[]>[]>(
    () => [
      {
        backgroundColor: green[500] + '50',
        borderColor: green[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: false,
        label: (locale === 'zhCN' && '节点创建') || 'Node create',
      },
      {
        backgroundColor: blue[500] + '50',
        borderColor: blue[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: false,
        label: (locale === 'zhCN' && '节点启动') || 'Node start',
      },
      {
        backgroundColor: yellow[500] + '50',
        borderColor: yellow[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: false,
        label: (locale === 'zhCN' && '节点停止') || 'Node stop',
      },
      {
        backgroundColor: red[500] + '50',
        borderColor: red[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: false,
        label: (locale === 'zhCN' && '节点销毁') || 'Node destory',
      },
    ],
    [locale],
  );
};

const useLabels = (api: string): string[] => {
  const name = useName();
  const resourceCluster = useResourceCluster(`${api}?name=${name}`);
  return resourceCluster instanceof Object
    ? resourceCluster.labels
    : ['', '', '', '', '', '', '', '', '', '', '', ''];
};

const options: ChartOptions<'line'> = {
  responsive: true,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  scales: {
    y: {
      min: 0,
      ticks: {
        precision: 0,
      },
    },
  },
};

const useChartBox = (api: string): JSX.Element => {
  return (
    <ChartBox
      config={config}
      data={useData(api)}
      datasets={useDatasets()}
      labels={useLabels(api)}
      options={options}
    />
  );
};

const actionMap = {
  zhCN: ['其他', '创建', '启动', '生产', '消费', '停止', '销毁'],
  enUS: ['Other', 'Create', 'Start', 'Produce', 'Consume', 'Stop', 'Destroy'],
};

const useResourceDocker = (api: string) => {
  const { data, error } = useSWR<ResourceDockerItem[]>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const useBody = (api: string) => {
  const name = useName();
  const locale = useLocale();
  const resourceDocker = useResourceDocker(`${api}?name=${name}`);
  return useMemo(() => {
    if (!Array.isArray(resourceDocker)) return [];
    return resourceDocker.map((value) => ({
      uid: { children: value.uid },
      timestamp: {
        children: format(value.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS'),
      },
      action: {
        children:
          (locale === 'zhCN' && actionMap.zhCN[value.action]) ||
          actionMap.enUS[value.action],
      },
      count: { children: value.count },
    }));
  }, [resourceDocker, locale]);
};

const useCollapse = (api: string) => {
  const name = useName();
  const locale = useLocale();
  const resourceDocker = useResourceDocker(`${api}?name=${name}`);
  const subbody = useMemo(() => {
    if (!Array.isArray(resourceDocker)) return [];
    return resourceDocker.map((value) => {
      return value.items.map((value) => ({
        timestamp: {
          children: format(value.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS'),
        },
        core: { children: value.core },
        memory: { children: value.memory },
        platformVersion: { children: value.platformVersion },
        action: {
          children:
            (locale === 'zhCN' && actionMap.zhCN[value.action]) ||
            actionMap.enUS[value.action],
        },
        payload: { children: value.payload },
      }));
    });
  }, [resourceDocker, locale]);
  const subhead = useMemo(
    () => [
      {
        key: 'timestamp',
        children: (locale === 'zhCN' && '时间戳') || 'Timestamp',
      },
      {
        key: 'core',
        children: (locale === 'zhCN' && '逻辑核心数') || 'Logical cores',
      },
      {
        key: 'memory',
        children: (locale === 'zhCN' && '内存总量 (GB)') || 'Total memory (GB)',
      },
      {
        key: 'platformVersion',
        children: (locale === 'zhCN' && '平台版本') || 'Platform version',
      },
      {
        key: 'action',
        children: (locale === 'zhCN' && '操作类型') || 'Action type',
      },
      {
        key: 'payload',
        children: (locale === 'zhCN' && '操作载荷') || 'Action payload',
      },
    ],
    [locale],
  );
  return useMemo(() => {
    return subbody.map((value) => {
      return (
        <CollapsibleTable
          body={value}
          head={subhead}
          tableProps={{ size: 'small', style: { backgroundColor: grey[200] } }}
        />
      );
    });
  }, [subbody, subhead]);
};

const useHead = () => {
  const locale = useLocale();
  return useMemo(
    () => [
      {
        key: 'uid',
        children: (locale === 'zhCN' && '容器标识') || 'Docker ID',
      },
      {
        key: 'timestamp',
        children:
          (locale === 'zhCN' && '最近操作时间戳') || 'Recent action timestamp',
      },
      {
        key: 'action',
        children: (locale === 'zhCN' && '最近操作类型') || 'Recent action type',
      },
      {
        key: 'count',
        children: (locale === 'zhCN' && '操作总数') || 'Total actions',
      },
    ],
    [locale],
  );
};

const useCollapsibleTable = (api: string): JSX.Element => {
  return (
    <CollapsibleTable
      body={useBody(api)}
      collapse={useCollapse(api)}
      head={useHead()}
    />
  );
};

const ResourcePage: FC = () => {
  const locale = useLocale();
  const classes = useStyles();
  const chartBox = useChartBox('/api/analysis/resource/cluster');
  const collapsibleTable = useCollapsibleTable('/api/analysis/resource/docker');

  return (
    <Fragment>
      <SideDrawer api={'/api/project/menu'} selectedName={'resource'} />
      <Container maxWidth={false} className={classes.root}>
        <Container maxWidth={false} className={classes.cluster}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '集群节点分析') || 'Cluster Nodes Analysis'}
          </Typography>
          {chartBox}
        </Container>
        <Container maxWidth={false} className={classes.docker}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '数据库容器分析') ||
              'Database Containers Analysis'}
          </Typography>
          {collapsibleTable}
        </Container>
      </Container>
    </Fragment>
  );
};

export default ResourcePage;
