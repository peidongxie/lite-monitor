import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';
import Logo from '../logo';

interface HeaderProps {
  name: string;
}

const useStyles = makeStyles(() => ({
  root: {
    height: 64,
  },
  logo: {},
  name: {
    fontWeight: 600,
  },
  space: {
    flexGrow: 1,
  },
}));

const Header: FC<HeaderProps> = (props) => {
  const { name } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar color={'default'} position='static'>
        <Toolbar>
          <IconButton className={classes.logo} color={'primary'}>
            <Logo fontSize={'large'} />
          </IconButton>
          <Typography className={classes.name} color={'primary'} variant={'h6'}>
            {name}
          </Typography>
          <span className={classes.space}></span>
          <Button color={'primary'}>登 录</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
