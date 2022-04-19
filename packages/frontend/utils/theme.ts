import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  useTheme as useMuiTheme,
  type Theme as MuiTheme,
  type ThemeOptions,
} from '@mui/material';
import { enUS, zhCN } from '@mui/material/locale';
import {
  createElement,
  useState,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
} from 'react';

type Locale = 'default' | 'zhCN' | 'enUS';

interface Theme extends MuiTheme {
  locale: Locale;
  setLocale: Dispatch<SetStateAction<Locale>>;
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

const themeMap: Record<Locale, MuiTheme> = {
  default: createTheme(themeOptions),
  zhCN: createTheme(themeOptions, zhCN),
  enUS: createTheme(themeOptions, enUS),
};

interface ThemeProviderProps {
  children?: ReactNode | undefined;
}

const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  const [locale, setLocale] = useState<Locale>('default');
  const theme = themeMap[locale] as Theme;
  theme.locale = locale;
  theme.setLocale = setLocale;
  return createElement(MuiThemeProvider, { theme }, props.children);
};

const useTheme = (): Theme => {
  return useMuiTheme<Theme>();
};

const useLocale = (): [Locale, Dispatch<SetStateAction<Locale>>] => {
  const theme = useTheme();
  return [theme.locale, theme.setLocale];
};

export {
  ThemeProvider,
  themeMap,
  useLocale,
  useTheme,
  type Locale,
  type Theme,
};
