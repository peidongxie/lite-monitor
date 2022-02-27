import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { blue, green, grey, yellow } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';
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

interface ComponentTime {
  data: number[][];
  labels: string[];
}

interface ComponentOperationItem {
  user: string;
  timestamp: number;
  action: number;
  operation: number;
  count: number;
  items: {
    timestamp: number;
    platform: string;
    platformVersion: string;
    xpath: string[];
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
  time: {
    padding: theme.spacing(2),
  },
  operation: {
    padding: theme.spacing(2),
  },
}));

const useComponentTime = (api: string) => {
  const { data, error } = useSWR<ComponentTime>(api, jsonFetcher);
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
  const componentTime = useComponentTime(`${api}?name=${name}`);
  return componentTime instanceof Object
    ? componentTime.data.map((value) =>
        value.map((value) => value / (60 * 1000)),
      )
    : [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];
};

const useDatasets = (): ChartDataset<'bar', number[]>[] => {
  const locale = useLocale();
  return useMemo<ChartDataset<'bar', number[]>[]>(
    () => [
      {
        backgroundColor: green[500] + '50',
        borderColor: green[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: false,
        label: (locale === 'zhCN' && '小题1') || 'Sub-question 1',
      },
      {
        backgroundColor: blue[500] + '50',
        borderColor: blue[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: false,
        label: (locale === 'zhCN' && '小题2') || 'Sub-question 2',
      },
      {
        backgroundColor: yellow[500] + '50',
        borderColor: yellow[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: false,
        label: (locale === 'zhCN' && '小题3') || 'Sub-question 3',
      },
    ],
    [locale],
  );
};

const useLabels = (api: string): string[] => {
  const name = useName();
  const componentTime = useComponentTime(`${api}?name=${name}`);
  return componentTime instanceof Object
    ? componentTime.labels
    : ['', '', '', '', '', '', '', ''];
};

const useOptions = (): ChartOptions<'bar'> => {
  const locale = useLocale();
  const unit = (locale === 'zhCN' && '分钟') || 'min';
  const label = (locale === 'zhCN' && '总计') || 'Total';
  return {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        min: 0,
        stacked: true,
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (item) => {
            const label = `${item.dataset.label}: ${item.formattedValue} ${unit}`;
            return item.raw === 0 ? '' : label;
          },
          footer: (items) => {
            const total = items
              .map((item) => item.raw as number)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
              );
            return `    ${label}: ${total.toFixed(3)} ${unit}`;
          },
        },
      },
    },
  };
};

const useChartBox = (api: string): JSX.Element => {
  return (
    <ChartBox
      config={config}
      data={useData(api)}
      datasets={useDatasets()}
      labels={useLabels(api)}
      options={useOptions()}
    />
  );
};

const actionMap = {
  zhCN: [
    '其他',
    '值改变',
    '点击',
    '指针进入',
    '指针离开',
    '拖动',
    '放下',
    '键按下',
    '剪切',
    '复制',
    '粘贴',
  ],
  enUS: [
    'Other',
    'Change',
    'Click',
    'Enter',
    'Out',
    'Drag',
    'Drop',
    'Press',
    'Cut',
    'Copy',
    'Paste',
  ],
};

const useComponentOperation = (api: string) => {
  const { data, error } = useSWR<ComponentOperationItem[]>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const useBody = (api: string) => {
  const name = useName();
  const locale = useLocale();
  const resourceDocker = useComponentOperation(`${api}?name=${name}`);
  return useMemo(() => {
    if (!Array.isArray(resourceDocker)) return [];
    return resourceDocker.map((value) => ({
      user: { children: value.user },
      timestamp: {
        children: format(value.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS'),
      },
      action: {
        children:
          (locale === 'zhCN' && actionMap.zhCN[value.action]) ||
          actionMap.enUS[value.action],
      },
      operation: { children: value.operation },
      count: { children: value.count },
    }));
  }, [resourceDocker, locale]);
};

const useCollapse = (api: string) => {
  const name = useName();
  const locale = useLocale();
  const resourceDocker = useComponentOperation(`${api}?name=${name}`);
  const subbody = useMemo(() => {
    if (!Array.isArray(resourceDocker)) return [];
    return resourceDocker.map((value) => {
      return value.items.map((value) => ({
        timestamp: {
          children: format(value.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS'),
        },
        platform: { children: value.platform },
        platformVersion: { children: value.platformVersion },
        xpath: { children: '/' + value.xpath.join('/') },
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
        key: 'platform',
        children: (locale === 'zhCN' && '平台类型') || 'Platform type',
      },
      {
        key: 'platformVersion',
        children: (locale === 'zhCN' && '平台版本') || 'Platform version',
      },
      {
        key: 'xpath',
        children: (locale === 'zhCN' && '组件 Xpath') || 'Component Xpath',
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
          (locale === 'zhCN' && '最近操作时间戳') || 'Recent action timestamp',
      },
      {
        key: 'action',
        children: (locale === 'zhCN' && '最近操作类型') || 'Recent action type',
      },
      {
        key: 'operation',
        children:
          (locale === 'zhCN' && '风险操作数') || 'Total risky operations',
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

const ComponentPage: FC = () => {
  const locale = useLocale();
  const classes = useStyles();
  const chartBox = useChartBox('/api/analysis/component/time');
  const collapsibleTable = useCollapsibleTable(
    '/api/analysis/component/operation',
  );

  return (
    <Fragment>
      <SideDrawer api={'/api/project/menu'} selectedName={'component'} />
      <Container maxWidth={false} className={classes.root}>
        <Container maxWidth={false} className={classes.time}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '答题耗时分析') ||
              'Time Consumption Analysis'}
          </Typography>
          {chartBox}
        </Container>
        <Container maxWidth={false} className={classes.operation}>
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '风险动作分析') ||
              'Risky Operations Analysis'}
          </Typography>
          {collapsibleTable}
        </Container>
      </Container>
    </Fragment>
  );
};

export default ComponentPage;
