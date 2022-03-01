import { type Theme } from '@mui/material';

declare module '@mui/styles' {
  interface DefaultTheme extends Theme {
    [key: string]: unknown;
  }
}
