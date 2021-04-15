import { createMuiTheme } from '@material-ui/core/styles';

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

const theme = createMuiTheme({
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
});

export default theme;
