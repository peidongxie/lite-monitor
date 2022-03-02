import {
  createTheme,
  useTheme as useMuiTheme,
  type Theme as MuiTheme,
  type ThemeOptions,
} from '@mui/material';
import { enUS, zhCN } from '@mui/material/locale';
import { type Locale } from './locale';

interface Theme extends MuiTheme {
  locale: Locale;
}

const themeOptions: ThemeOptions = {
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
    fontFamily: [
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
    ].join(','),
  },
};

const themeMap: Record<Locale, Theme> = {
  default: createTheme(themeOptions, { locale: 'default' }) as Theme,
  zhCN: createTheme(themeOptions, { locale: 'zhCN' }, zhCN) as Theme,
  enUS: createTheme(themeOptions, { locale: 'enUS' }, enUS) as Theme,
};

const useTheme = (): Theme => {
  return useMuiTheme<Theme>();
};

export { themeMap, useTheme, type Theme };
