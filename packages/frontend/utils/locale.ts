import { useTheme } from './theme';

type Locale = 'default' | 'zhCN' | 'enUS';

const localeMap: Record<Locale, string> = {
  default: '',
  zhCN: '简体中文',
  enUS: 'English',
};

const useLocale = (): Locale => {
  return useTheme().locale;
};

export { localeMap, useLocale, type Locale };
