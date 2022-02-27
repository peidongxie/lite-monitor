import { Theme, ThemeOptions, createTheme } from '@mui/material/styles';
import { zhCN, enUS } from '@mui/material/locale';
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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
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
          alignContent: 'flex-start',
          display: 'flex',
          flexWrap: 'wrap',
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
  default: createTheme(themeOptions, { locale: 'default' }),
  zhCN: createTheme(themeOptions, zhCN, { locale: 'zhCN' }),
  enUS: createTheme(themeOptions, enUS, { locale: 'enUS' }),
};
