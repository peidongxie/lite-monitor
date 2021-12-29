import { useTheme, type Theme } from '@material-ui/core/styles';

type Locale = 'default' | 'zhCN' | 'enUS';

const useLocale = (): Locale => {
  const theme = useTheme() as Theme & { locale: Locale };
  return theme.locale;
};

const localeMap: Record<Locale, string> = {
  default: '',
  zhCN: '简体中文',
  enUS: 'English',
};

export { localeMap, useLocale, type Locale };
