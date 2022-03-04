import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { blue, grey, red } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';
import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';
import { FC, Fragment, useMemo } from 'react';
import useSWR from 'swr';
import ChartBox from '../../components/chart-box';
import CollapsibleTable from '../../components/collapsible-table';
import SideDrawer from '../../components/side-drawer';
import { jsonFetcher } from '../../utils/fetcher';
import { useLocale } from '../../utils/theme';
import { useName } from '../../utils/router';
import { format } from '../../utils/time';

interface ErrorTrend {
  data: number[][];
  labels: string[];
}

interface ErrorDetailItem {
  name: string;
  message: string;
  stack: string[];
  count: number;
  items: {
    timestamp: number;
    user: string;
    core: number;
    memory: number;
    platform: string;
    platformVersion: string;
  }[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 5),
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
    labels: [],
    datasets: [],
  },
};

const useData = (api: string): number[][] => {
  const name = useName();
  const errorTrend = useErrorTrend(`${api}?name=${name}`);
  return errorTrend instanceof Object
    ? errorTrend.data
    : [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
};

const useDatasets = (): ChartDataset<'line', number[]>[] => {
  const [locale] = useLocale();
  return useMemo<ChartDataset<'line', number[]>[]>(
    () => [
      {
        backgroundColor: red[500] + '50',
        borderColor: red[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: false,
        label: (locale === 'zhCN' && '错误总数') || 'Error occurrences',
      },
      {
        backgroundColor: blue[500] + '50',
        borderColor: blue[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: true,
        label: (locale === 'zhCN' && '影响人数') || 'Users affected',
      },
    ],
    [locale],
  );
};

const useLabels = (api: string): string[] => {
  const name = useName();
  const errorTrend = useErrorTrend(`${api}?name=${name}`);
  return errorTrend instanceof Object
    ? errorTrend.labels
    : ['', '', '', '', '', '', '', '', '', ''];
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

const useChartBox = (api: string) => {
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

const useErrorDetail = (api: string) => {
  const { data, error } = useSWR<ErrorDetailItem[]>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const useBody = (api: string) => {
  const name = useName();
  const errorDetail = useErrorDetail(`${api}?name=${name}`);
  return useMemo(() => {
    if (!Array.isArray(errorDetail)) return [];
    return errorDetail.map((value) => ({
      name: { children: value.name },
      message: { children: value.message },
      stack: { children: value.stack[value.stack.length - 1] },
      count: { children: value.count },
    }));
  }, [errorDetail]);
};

const useCollapse = (api: string) => {
  const name = useName();
  const [locale] = useLocale();
  const errorDetail = useErrorDetail(`${api}?name=${name}`);
  const subbody = useMemo(() => {
    if (!Array.isArray(errorDetail)) return [];
    return errorDetail.map((value) => {
      return value.items.map((value) => ({
        timestamp: {
          children: format(value.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS'),
        },
        user: { children: value.user },
        core: { children: value.core },
        memory: { children: value.memory },
        platform: { children: value.platform },
        platformVersion: { children: value.platformVersion },
      }));
    });
  }, [errorDetail]);
  const subhead = useMemo(
    () => [
      {
        key: 'timestamp',
        children: (locale === 'zhCN' && '时间戳') || 'Timestamp',
      },
      {
        key: 'user',
        children: (locale === 'zhCN' && '用户标识') || 'User ID',
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
        key: 'platform',
        children: (locale === 'zhCN' && '平台类型') || 'Platform type',
      },
      {
        key: 'platformVersion',
        children: (locale === 'zhCN' && '平台版本') || 'Platform version',
      },
    ],
    [locale],
  );
  return useMemo(() => {
    return subbody.map((value, index) => {
      return (
        <CollapsibleTable
          body={value}
          head={subhead}
          key={index}
          tableProps={{ size: 'small', style: { backgroundColor: grey[200] } }}
        />
      );
    });
  }, [subbody, subhead]);
};

const useHead = () => {
  const [locale] = useLocale();
  return useMemo(
    () => [
      {
        key: 'name',
        children: (locale === 'zhCN' && '错误名称') || 'Error name',
      },
      {
        key: 'message',
        children: (locale === 'zhCN' && '错误描述') || 'Error message',
      },
      {
        key: 'stack',
        children: (locale === 'zhCN' && '错误堆栈') || 'Error stack',
      },
      {
        key: 'count',
        children: (locale === 'zhCN' && '错误总数') || 'Total errors',
      },
    ],
    [locale],
  );
};

const useCollapsibleTable = (api: string) => {
  return (
    <CollapsibleTable
      body={useBody(api)}
      collapse={useCollapse(api)}
      head={useHead()}
    />
  );
};

const ErrorPage: FC = () => {
  const [locale] = useLocale();
  const classes = useStyles();
  const chartBox = useChartBox('/api/analysis/error/trend');
  const collapsibleTable = useCollapsibleTable('/api/analysis/error/detail');

  return (
    <Fragment>
      <SideDrawer api={'/api/project/menu'} selectedName={'error'} />
      <Container maxWidth={false} className={classes.root}>
        <Container maxWidth={false} className={classes.trend}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '错误趋势分析') || 'Error Trends Analysis'}
          </Typography>
          {chartBox}
        </Container>
        <Container maxWidth={false} className={classes.detail}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '错误详情分析') || 'Error Details Analysis'}
          </Typography>
          {collapsibleTable}
        </Container>
      </Container>
    </Fragment>
  );
};

export default ErrorPage;
