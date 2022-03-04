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

interface MessageCode {
  data: number[][];
  labels: string[];
}

interface MessageLocationItem {
  auth: string;
  timestamp: number;
  ip: [string, string];
  location: number;
  count: number;
  items: {
    timestamp: number;
    method: string;
    protocol: string;
    port: number;
    version: string;
    ip: [string, string];
    code: number;
  }[];
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
  location: {
    padding: theme.spacing(2),
  },
}));

const useMessageCode = (api: string) => {
  const { data, error } = useSWR<MessageCode>(api, jsonFetcher);
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
  const messageCode = useMessageCode(`${api}?name=${name}`);
  return messageCode instanceof Object
    ? messageCode.data
    : [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];
};

const useDatasets = (): ChartDataset<'bar', number[]>[] => {
  const [locale] = useLocale();
  return useMemo<ChartDataset<'bar', number[]>[]>(
    () => [
      {
        backgroundColor: red[500] + '50',
        borderColor: red[500],
        data: [],
        label: (locale === 'zhCN' && '异常总数') || 'Exception occurrences',
        yAxisID: 'y0',
      },
      {
        backgroundColor: blue[500] + '50',
        borderColor: blue[500],
        data: [],
        label: (locale === 'zhCN' && '异常比例') || 'Exception percentage',
        yAxisID: 'y1',
      },
    ],
    [locale],
  );
};

const useLabels = (api: string): string[] => {
  const name = useName();
  const messageCode = useMessageCode(`${api}?name=${name}`);
  return messageCode instanceof Object
    ? messageCode.labels
    : ['', '', '', '', '', '', '', ''];
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

const useMessageLocation = (api: string) => {
  const { data, error } = useSWR<MessageLocationItem[]>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const useBody = (api: string) => {
  const name = useName();
  const messageLocation = useMessageLocation(`${api}?name=${name}`);
  return useMemo(() => {
    if (!Array.isArray(messageLocation)) return [];
    return messageLocation.map((value) => ({
      auth: { children: value.auth },
      timestamp: {
        children: format(value.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS'),
      },
      ip: { children: value.ip[0] },
      location: { children: value.location },
      count: { children: value.count },
    }));
  }, [messageLocation]);
};

const useCollapse = (api: string) => {
  const name = useName();
  const [locale] = useLocale();
  const messageLocation = useMessageLocation(`${api}?name=${name}`);
  const subbody = useMemo(() => {
    if (!Array.isArray(messageLocation)) return [];
    return messageLocation.map((value) => {
      return value.items.map((value) => ({
        timestamp: {
          children: format(value.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS'),
        },
        method: { children: value.method },
        protocol: { children: value.protocol },
        port: { children: value.port },
        version: { children: value.version },
        ip: { children: value.ip[0] },
        code: { children: value.code },
      }));
    });
  }, [messageLocation]);
  const subhead = useMemo(
    () => [
      {
        key: 'timestamp',
        children: (locale === 'zhCN' && '时间戳') || 'Timestamp',
      },
      {
        key: 'method',
        children: (locale === 'zhCN' && '报文方法') || 'Message method',
      },
      {
        key: 'protocol',
        children: (locale === 'zhCN' && '报文协议') || 'Message protocol',
      },
      {
        key: 'port',
        children: (locale === 'zhCN' && '报文端口') || 'Message port',
      },
      {
        key: 'version',
        children: (locale === 'zhCN' && '报文路径') || 'Message version',
      },
      {
        key: 'ip',
        children: (locale === 'zhCN' && '登录地 IP') || 'Location IP',
      },
      {
        key: 'code',
        children: (locale === 'zhCN' && '报文状态码') || 'Message code',
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
        key: 'auth',
        children: (locale === 'zhCN' && '授权标识') || 'Authorization ID',
      },
      {
        key: 'timestamp',
        children:
          (locale === 'zhCN' && '最近使用时间戳') || 'Recent usage timestamp',
      },
      {
        key: 'ip',
        children:
          (locale === 'zhCN' && '最近登录地 IP') || 'Recent location IP',
      },
      {
        key: 'location',
        children: (locale === 'zhCN' && '登录地总数') || 'Total locations',
      },
      {
        key: 'count',
        children: (locale === 'zhCN' && '使用总数') || 'Total usage',
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

const MessagePage: FC = () => {
  const [locale] = useLocale();
  const classes = useStyles();
  const chartBox = useChartBox('/api/analysis/message/code');
  const collapsibleTable = useCollapsibleTable(
    '/api/analysis/message/location',
  );

  return (
    <Fragment>
      <SideDrawer api={'/api/project/menu'} selectedName={'message'} />
      <Container maxWidth={false} className={classes.root}>
        <Container maxWidth={false} className={classes.code}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '异常响应分析') ||
              'Abnormal Responses Analysis'}
          </Typography>
          {chartBox}
        </Container>
        <Container maxWidth={false} className={classes.location}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '异常登录地分析') ||
              'Abnormal Locations Analysis'}
          </Typography>
          {collapsibleTable}
        </Container>
      </Container>
    </Fragment>
  );
};

export default MessagePage;
