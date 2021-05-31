import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { blue, grey, red } from '@material-ui/core/colors';
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

interface AccessStatus {
  data: number[][];
  labels: string[];
}

interface AccessRecordItem {
  user: string;
  timestamp: number;
  method: number;
  page: number;
  activity: number;
  items: {
    timestamp: number;
    method: number;
    host: string;
    path: string;
  }[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 5),
    margin: theme.spacing(8, 0, 0, 32),
    overflowX: 'hidden',
  },
  status: {
    padding: theme.spacing(2),
  },
  record: {
    padding: theme.spacing(2),
  },
}));

const useAccessStatus = (api: string) => {
  const { data, error } = useSWR<AccessStatus>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const config: ChartConfiguration<'bar', number[], string> = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [],
  },
};

const useData = (api: string): number[][] => {
  const name = useName();
  const accessStatus = useAccessStatus(`${api}?name=${name}`);
  return accessStatus instanceof Object ? accessStatus.data : [[0, 0, 0, 0]];
};

const useDatasets = (): ChartDataset<'bar', number[]>[] => {
  const locale = useLocale();
  return useMemo<ChartDataset<'bar', number[]>[]>(
    () => [
      {
        backgroundColor: blue[500] + '50',
        borderColor: blue[500],
        data: [],
        label: (locale === 'zhCN' && '考生人数') || 'Candidates',
      },
    ],
    [locale],
  );
};

const useLabels = (api: string): string[] => {
  const name = useName();
  const locale = useLocale();
  const accessStatus = useAccessStatus(`${api}?name=${name}`);
  return accessStatus instanceof Object
    ? accessStatus.labels.map((label) => {
        if (label === '0') return (locale === 'zhCN' && '已进入') || 'Entered';
        if (label === '1') return (locale === 'zhCN' && '候考中') || 'Waiting';
        if (label === '2') return (locale === 'zhCN' && '考试中') || 'In exam';
        if (label === '3') return (locale === 'zhCN' && '已离开') || 'Left';
        return '';
      })
    : ['', '', '', ''];
};

const options: ChartOptions<'bar'> = {
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

const methodMap = {
  zhCN: ['其他', '进入', '跳转', '离开', '激活', '休眠'],
  enUS: ['Other', 'Enter', 'Switch', 'Leave', 'Activate', 'Inactivate'],
};

const useAccessRecord = (api: string) => {
  const { data, error } = useSWR<AccessRecordItem[]>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const useBody = (api: string) => {
  const name = useName();
  const locale = useLocale();
  const accessRecord = useAccessRecord(`${api}?name=${name}`);
  return useMemo(() => {
    if (!Array.isArray(accessRecord)) return [];
    return accessRecord.map((value) => ({
      user: { children: value.user },
      timestamp: {
        children: format(value.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS'),
      },
      method: {
        children:
          (locale === 'zhCN' && methodMap.zhCN[value.method]) ||
          methodMap.enUS[value.method],
      },
      page: { children: value.page },
      activity: { children: value.activity },
    }));
  }, [accessRecord, locale]);
};

const useCollapse = (api: string) => {
  const name = useName();
  const locale = useLocale();
  const accessRecord = useAccessRecord(`${api}?name=${name}`);
  const subbody = useMemo(() => {
    if (!Array.isArray(accessRecord)) return [];
    return accessRecord.map((value) => {
      return value.items.map((value) => ({
        timestamp: {
          children: format(value.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS'),
        },
        method: {
          children:
            (locale === 'zhCN' && methodMap.zhCN[value.method]) ||
            methodMap.enUS[value.method],
        },
        host: { children: value.host },
        path: { children: value.path },
      }));
    });
  }, [accessRecord, locale]);
  const subhead = useMemo(
    () => [
      {
        key: 'timestamp',
        children: (locale === 'zhCN' && '时间戳') || 'Timestamp',
      },
      {
        key: 'method',
        children: (locale === 'zhCN' && '访问类型') || 'Access method',
      },
      {
        key: 'host',
        children: (locale === 'zhCN' && '访问地址') || 'Access host',
      },
      {
        key: 'path',
        children: (locale === 'zhCN' && '访问路径') || 'Access path',
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
        key: 'user',
        children: (locale === 'zhCN' && '用户标识') || 'User ID',
      },
      {
        key: 'timestamp',
        children:
          (locale === 'zhCN' && '最近访问时间戳') || 'Recent access timestamp',
      },
      {
        key: 'method',
        children: (locale === 'zhCN' && '最近访问类型') || 'Recent access type',
      },
      {
        key: 'page',
        children:
          (locale === 'zhCN' && '页面切换总数') || 'Total page switches',
      },
      {
        key: 'activity',
        children:
          (locale === 'zhCN' && '活跃改变总数') || 'Total activity changes',
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

const AccessPage: FC = () => {
  const locale = useLocale();
  const classes = useStyles();
  const chartBox = useChartBox('/api/analysis/access/status');
  const collapsibleTable = useCollapsibleTable('/api/analysis/access/record');

  return (
    <Fragment>
      <SideDrawer api={'/api/project/menu'} selectedName={'access'} />
      <Container maxWidth={false} className={classes.root}>
        <Container maxWidth={false} className={classes.status}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '考生状态分析') ||
              'Examinee Status Analysis'}
          </Typography>
          {chartBox}
        </Container>
        <Container maxWidth={false} className={classes.record}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '考场出入分析') || 'Access Records Analysis'}
          </Typography>
          {collapsibleTable}
        </Container>
      </Container>
    </Fragment>
  );
};

export default AccessPage;
