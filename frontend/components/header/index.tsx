import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import Label from '../label';
import Lang from '../lang';
import Login from '../login';
import { Locale, useLocale } from '../../utils/locale';

interface HeaderProps {
  setLocale: Dispatch<SetStateAction<Locale>>;
  title: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: 64,
  },
  label: {},
  options: {},
  space: {
    flexGrow: 1,
  },
}));

const Header: FC<HeaderProps> = (props) => {
  const { setLocale, title } = props;
  const [options, setOptions] = useState([]);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar color={'default'} position='static'>
        <Toolbar>
          <Label className={classes.label} title={title} />
          <span className={classes.space}></span>
          <Login link={'/api/user/info'} />
          <Lang setLocale={setLocale} />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
