import { Container, Typography, colors } from '@mui/material';
import {
  type ChartConfiguration,
  type ChartDataset,
  type ChartOptions,
} from 'chart.js';
import { Fragment, useMemo, type FC } from 'react';
import useSWR from 'swr';
import ChartBox from '../../components/chart-box';
import CollapsibleTable from '../../components/collapsible-table';
import SideDrawer from '../../components/side-drawer';
import { jsonFetcher } from '../../utils/fetcher';
import { useLocale } from '../../utils/theme';
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
  const [locale] = useLocale();
  return useMemo<ChartDataset<'bar', number[]>[]>(
    () => [
      {
        backgroundColor: colors.green[500] + '50',
        borderColor: colors.green[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: false,
        label: (locale === 'zhCN' && '??????1') || 'Sub-question 1',
      },
      {
        backgroundColor: colors.blue[500] + '50',
        borderColor: colors.blue[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: false,
        label: (locale === 'zhCN' && '??????2') || 'Sub-question 2',
      },
      {
        backgroundColor: colors.yellow[500] + '50',
        borderColor: colors.yellow[500],
        cubicInterpolationMode: 'monotone',
        data: [],
        fill: false,
        label: (locale === 'zhCN' && '??????3') || 'Sub-question 3',
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
  const [locale] = useLocale();
  const unit = (locale === 'zhCN' && '??????') || 'min';
  const label = (locale === 'zhCN' && '??????') || 'Total';
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
    '??????',
    '?????????',
    '??????',
    '????????????',
    '????????????',
    '??????',
    '??????',
    '?????????',
    '??????',
    '??????',
    '??????',
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
  const [locale] = useLocale();
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
  const [locale] = useLocale();
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
        children: (locale === 'zhCN' && '?????????') || 'Timestamp',
      },
      {
        key: 'platform',
        children: (locale === 'zhCN' && '????????????') || 'Platform type',
      },
      {
        key: 'platformVersion',
        children: (locale === 'zhCN' && '????????????') || 'Platform version',
      },
      {
        key: 'xpath',
        children: (locale === 'zhCN' && '?????? Xpath') || 'Component Xpath',
      },
      {
        key: 'action',
        children: (locale === 'zhCN' && '????????????') || 'Action type',
      },
      {
        key: 'payload',
        children: (locale === 'zhCN' && '????????????') || 'Action payload',
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
          tableProps={{
            size: 'small',
            style: { backgroundColor: colors.grey[200] },
          }}
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
        key: 'user',
        children: (locale === 'zhCN' && '????????????') || 'User ID',
      },
      {
        key: 'timestamp',
        children:
          (locale === 'zhCN' && '?????????????????????') || 'Recent action timestamp',
      },
      {
        key: 'action',
        children: (locale === 'zhCN' && '??????????????????') || 'Recent action type',
      },
      {
        key: 'operation',
        children:
          (locale === 'zhCN' && '???????????????') || 'Total risky operations',
      },
      {
        key: 'count',
        children: (locale === 'zhCN' && '????????????') || 'Total actions',
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
  const [locale] = useLocale();
  const chartBox = useChartBox('/api/analysis/component/time');
  const collapsibleTable = useCollapsibleTable(
    '/api/analysis/component/operation',
  );

  return (
    <Fragment>
      <SideDrawer api={'/api/project/menu'} selectedName={'component'} />
      <Container
        maxWidth={false}
        sx={{
          padding: (theme) => theme.spacing(2, 5),
          margin: (theme) => theme.spacing(8, 0, 0, 32),
          overflowX: 'hidden',
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            padding: (theme) => theme.spacing(2),
          }}
        >
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '??????????????????') ||
              'Time Consumption Analysis'}
          </Typography>
          {chartBox}
        </Container>
        <Container
          maxWidth={false}
          sx={{
            padding: (theme) => theme.spacing(2),
          }}
        >
          <Typography variant={'h6'}>
            {(locale === 'zhCN' && '??????????????????') ||
              'Risky Operations Analysis'}
          </Typography>
          {collapsibleTable}
        </Container>
      </Container>
    </Fragment>
  );
};

export default ComponentPage;
