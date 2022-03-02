import { type Theme } from './utils/theme';

declare module '@mui/styles' {
  interface DefaultTheme extends Theme {
    [key: string]: unknown;
  }
}
