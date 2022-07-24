import {
  ExpandMore as ExpandMoreIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material';
import {
  Fragment,
  useCallback,
  useState,
  type FC,
  type MouseEventHandler,
} from 'react';
import { useLocale, type Locale } from '../../utils/theme';

interface LangProps {
  [key: string]: never;
}

const localeText: Record<Locale, string> = {
  default: 'Default',
  zhCN: '简体中文',
  enUS: 'English',
};

const Lang: FC<LangProps> = () => {
  const [locale, setLocale] = useLocale();
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
      <Button color={'primary'} onClick={handleButtonClick}>
        <TranslateIcon />
        <Typography
          sx={{
            width: 64,
          }}
          variant={'subtitle2'}
          variantMapping={{ subtitle2: 'span' }}
        >
          {localeText[locale]}
        </Typography>
        <ExpandMoreIcon fontSize={'small'} />
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        keepMounted
        onClose={handlePopoverClose}
        open={Boolean(anchorEl)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List
          sx={{
            padding: 0,
          }}
        >
          <ListItem
            button
            dense
            onClick={wrapItemClick('zhCN')}
            selected={locale === 'zhCN'}
          >
            <ListItemText>{localeText.zhCN}</ListItemText>
          </ListItem>
          <ListItem
            button
            dense
            onClick={wrapItemClick('enUS')}
            selected={locale === 'enUS'}
          >
            <ListItemText>{localeText.enUS}</ListItemText>
          </ListItem>
        </List>
      </Popover>
    </Fragment>
  );
};

export default Lang;
