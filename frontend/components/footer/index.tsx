import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import GitHubIcon from '@material-ui/icons/GitHub';
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
    height: 48,
    margin: theme.spacing(1, 0),
    color: theme.palette.grey[700],
    display: 'inline-block',
  },
  link: {
    margin: '7px 8px 11px 8px',
  },
}));

const Footer: FC<FooterProps> = (props) => {
  const { year } = props;
  const classes = useStyles();
  return (
    <footer className={classes.root}>
      <Typography
        className={classes.copyright}
        color={'textSecondary'}
        variant={'body2'}
      >
        {'Copyright @ '}
        {year || new Date().getFullYear()}
        <IconButton
          className={classes.link}
          color={'inherit'}
          component={'a'}
          href={'https://github.com/peidongxie/lite-monitor'}
          size={'small'}
        >
          <GitHubIcon />
        </IconButton>
      </Typography>
    </footer>
  );
};

export default Footer;
