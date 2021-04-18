import { Theme, ThemeOptions, createMuiTheme } from '@material-ui/core/styles';
import { zhCN, enUS } from '@material-ui/core/locale';
import { Locale } from './locale';

const fonts = [
  '-apple-system',
  'BlinkMacSystemFont',
  'PingFang SC',
  'Source Han Sans',
  'Segoe UI',
  'Microsoft Yahei',
  'WenQuanYi Micro Hei',
  'San Francisco',
  'Helvetica Neue',
  'Tahoma',
  'Aria',
  'sans-serif',
];

export const themeOptions: ThemeOptions = {
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          width: '100%',
          height: '100%',
        },
        body: {
          width: '100%',
          height: '100%',
          fontFamily: fonts.join(', '),
        },
        '#__next': {
          width: '100%',
          height: '100%',
        },
        a: {
          color: 'inherit',
          textDecoration: 'none',
        },
      },
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
};

export const themeMap: Record<Locale, Theme> = {
  default: createMuiTheme(themeOptions),
  zhCN: createMuiTheme(themeOptions, zhCN, { locale: 'zhCN' }),
  enUS: createMuiTheme(themeOptions, enUS, { locale: 'enUS' }),
};
