import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FC } from 'react';

interface FooterProps {
  year?: number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 64,
    borderTopColor: theme.palette.grey[200],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    textAlign: 'center',
  },
  copyright: {
    margin: theme.spacing(2.5, 0),
    color: theme.palette.grey[700],
    display: 'inline-block',
  },
}));

const Footer: FC<FooterProps> = (props) => {
  const { year } = props;
  const classes = useStyles();
  const theme = useTheme();
  console.log(theme);
  return (
    <footer className={classes.root}>
      <Typography className={classes.copyright} variant={'caption'}>
        {'Copyright @ '}
        {year || new Date().getFullYear()}
      </Typography>
    </footer>
  );
};

export default Footer;
