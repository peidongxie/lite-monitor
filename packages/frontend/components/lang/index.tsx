import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LanguageIcon from '@mui/icons-material/Translate';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
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
  const locale = useLocale();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
