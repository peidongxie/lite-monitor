import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import ComboBox from '../combo-box';
import Label from '../label';
import Lang from '../lang';
import Login from '../login';
import { Locale } from '../../utils/locale';

interface HeaderProps {
  setLocale: Dispatch<SetStateAction<Locale>>;
  title: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: 64,
  },
}));

const Header: FC<HeaderProps> = (props) => {
  const { setLocale, title } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar color={'default'} position='static'>
        <Toolbar>
          <Label link={'/'} title={title} />
          <ComboBox link={'/api/project'} />
          <span style={{ flexGrow: 1 }} />
          <Login link={'/api/user/auth'} />
          <Lang setLocale={setLocale} />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
