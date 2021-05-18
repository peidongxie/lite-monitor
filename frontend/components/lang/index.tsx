import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LanguageIcon from '@material-ui/icons/Translate';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
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
  },
  expand: {},
  popover: {},
  list: {
    padding: 0,
  },
}));

const Lang: FC<LangProps> = (props) => {
  const { setLocale } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const locale = useLocale();
  const classes = useStyles();

  const handleButtonClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => setAnchorEl(event.currentTarget),
    [],
  );
  const handlePopoverClose = useCallback(() => setAnchorEl(null), []);
  const wrapItemClick = (locale: Locale) => () => {
    setLocale(locale);
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Button
        className={classes.button}
        color={'primary'}
        onClick={handleButtonClick}
      >
        <LanguageIcon className={classes.icon} />
        <Typography
          className={classes.language}
          variant={'subtitle2'}
          variantMapping={{ subtitle2: 'span' }}
        >
          {localeMap[locale]}
        </Typography>
        <ExpandMoreIcon className={classes.expand} fontSize={'small'} />
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        className={classes.popover}
        keepMounted
        onClose={handlePopoverClose}
        open={Boolean(anchorEl)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List className={classes.list}>
          <ListItem
            button
            dense
            onClick={wrapItemClick('zhCN')}
            selected={locale === 'zhCN'}
          >
            <ListItemText>{localeMap.zhCN}</ListItemText>
          </ListItem>
          <ListItem
            button
            dense
            onClick={wrapItemClick('enUS')}
            selected={locale === 'enUS'}
          >
            <ListItemText>{localeMap.enUS}</ListItemText>
          </ListItem>
        </List>
      </Popover>
    </Fragment>
  );
};

export default Lang;
