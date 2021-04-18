import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LanguageIcon from '@material-ui/icons/Translate';
import { makeStyles } from '@material-ui/core/styles';
import { FC, Fragment, MouseEventHandler, useCallback, useState } from 'react';
import { Locale, localeMap, useLocale } from '../../utils/locale';

interface LangProps {
  setLocale: (locale: Locale) => void;
}

const useStyles = makeStyles(() => ({
  button: {},
  icon: {},
  language: {
    width: 64,
    display: 'inline-block',
  },
  expand: {},
  menu: {},
}));

const Lang: FC<LangProps> = (props) => {
  const { setLocale } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const locale = useLocale();
  const classes = useStyles();
  const handleRootClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => setAnchorEl(event.currentTarget),
    [],
  );
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const wrapMenuItemClick = (locale: Locale) => () => {
    setLocale(locale);
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Button
        className={classes.button}
        color={'primary'}
        onClick={handleRootClick}
      >
        <LanguageIcon className={classes.icon} />
        <span className={classes.language}>{localeMap[locale]}</span>
        <ExpandMoreIcon className={classes.expand} fontSize={'small'} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        className={classes.menu}
        keepMounted
        onClose={handleMenuClose}
        open={Boolean(anchorEl)}
      >
        <MenuItem onClick={wrapMenuItemClick('zhCN')}>
          {localeMap.zhCN}
        </MenuItem>
        <MenuItem onClick={wrapMenuItemClick('enUS')}>
          {localeMap.enUS}
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default Lang;
