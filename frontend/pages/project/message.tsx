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
import { Locale, useLocale } from '../../utils/locale';
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

const useData = (): number[][] => {
  const messageCode = useMessageCode('/api/analysis/message/code');
  return messageCode instanceof Object
    ? messageCode.data
    : [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];
};

const useDatasets = (locale: Locale): ChartDataset<'bar', number[]>[] => {
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

const useLabels = (): string[] => {
  const messageCode = useMessageCode('/api/analysis/message/code');
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

const useChartBox = (locale: Locale): JSX.Element => {
  return (
    <ChartBox
      config={config}
      data={useData()}
      datasets={useDatasets(locale)}
      labels={useLabels()}
      options={options}
    />
  );
};

const useMessageLocation = (api: string) => {
  const { data, error } = useSWR<MessageLocationItem[]>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const useBody = () => {
  const messageLocation = useMessageLocation('/api/analysis/message/location');
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

const useCollapse = (locale: Locale) => {
  const messageLocation = useMessageLocation('/api/analysis/message/location');
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

const useHead = (locale: Locale) => {
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

const useCollapsibleTable = (locale: Locale): JSX.Element => {
  return (
    <CollapsibleTable
      body={useBody()}
      collapse={useCollapse(locale)}
      head={useHead(locale)}
    />
  );
};

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
  const chartBox = useChartBox(locale);
  const collapsibleTable = useCollapsibleTable(locale);

  return (
    <Fragment>
      <SideDrawer items={menuItems} />
      <Container maxWidth={false} className={classes.root}>
        <Container maxWidth={false} className={classes.code}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '异常响应分析') ||
              'Abnormal Response Analysis'}
          </Typography>
          {chartBox}
        </Container>
        <Container maxWidth={false} className={classes.location}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '异常登录地分析') ||
              'Abnormal Location Analysis'}
          </Typography>
          {collapsibleTable}
        </Container>
      </Container>
    </Fragment>
  );
};

export default MessagePage;
