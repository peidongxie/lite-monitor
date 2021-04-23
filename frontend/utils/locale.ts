import { Theme, useTheme } from '@material-ui/core/styles';

export type Locale = 'default' | 'zhCN' | 'enUS';

export const useLocale = (): Locale => {
  const theme = useTheme() as Theme & { locale: Locale };
  return theme.locale;
};

export const localeMap: Record<Locale, string> = {
  default: '',
  zhCN: '简体中文',
  enUS: 'English',
};