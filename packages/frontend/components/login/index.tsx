import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  type ChangeEventHandler,
  type FC,
  type MouseEventHandler,
} from 'react';
import Label from '../label';
import { useOpenAlert } from '../../utils/alert';
import { jsonFetcher } from '../../utils/fetcher';
import { useLocale } from '../../utils/theme';
import { useConditionalState } from '../../utils/store';

interface LoginProps {
  api: string;
}

const Login: FC<LoginProps> = (props) => {
  const { api } = props;
  const [locale] = useLocale();
  const [showName, setShowName] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [getName, setName] = useConditionalState('');
  const [getPassword, setPassword] = useConditionalState('');
  const subtitle = (locale === 'zhCN' && '登 录') || 'Log In';
  const message = (locale === 'zhCN' && '登录失败') || 'Log in failed';

  const openAlert = useOpenAlert();
  const handleButtonClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      if (showName) setAnchorEl(event.currentTarget);
      else setOpen(true);
    },
    [showName],
  );
  const handlePopoverClose = useCallback(() => setAnchorEl(null), []);
  const handleItemClick = useCallback(() => {
    setShowName('');
    localStorage.removeItem('token');
    setAnchorEl(null);
  }, []);
  const handleDialogClose = useCallback(() => {
    setOpen(false);
    setName('');
    setPassword('');
  }, [setName, setPassword]);
  const handleNameChange = useCallback<
    ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  >(
    (e) => {
      const name = e.target.value;
      setName(name);
      if (name) setNameError(false);
    },
    [setName],
  );
  const handlePasswordChange = useCallback<
    ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  >(
    (e) => {
      const password = e.target.value;
      setPassword(password);
      if (password) setPasswordError(false);
    },
    [setPassword],
  );
  const handleLogin = useCallback(
    async (body?: { name: string; password: string }) => {
      const user: {
        showName: string;
        token: string;
      } = await jsonFetcher(api, 'POST', body);
      const { showName, token } = user;
      localStorage.setItem('token', token);
      setShowName(showName);
      handleDialogClose();
    },
    [api, handleDialogClose],
  );
  const handleActionsClick = useCallback(async () => {
    const name = getName();
    const password = getPassword();
    if (!name) setNameError(true);
    if (!password) setPasswordError(true);
    if (name && password) {
      handleLogin({ name, password }).catch(() => {
        openAlert(message, 'error');
      });
    }
  }, [getName, getPassword, handleLogin, message, openAlert]);

  useEffect(() => {
    if (localStorage.getItem('token')) handleLogin();
  }, [handleLogin]);

  return (
    <Fragment>
      <Button color={'primary'} onClick={handleButtonClick}>
        <AccountCircleIcon />
        <Typography
          sx={{
            width: 64,
          }}
          variant={'subtitle2'}
          variantMapping={{ subtitle2: 'span' }}
        >
          {showName || subtitle}
        </Typography>
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
          <ListItem button onClick={handleItemClick}>
            <ListItemText primaryTypographyProps={{ color: 'error' }}>
              {(locale === 'zhCN' && '退出登录') || 'Log out'}
            </ListItemText>
          </ListItem>
        </List>
      </Popover>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle
          sx={{
            padding: (theme) => theme.spacing(6, 5, 1, 5),
            textAlign: 'center',
          }}
        >
          <Label title={'Lite Monitor'} />
        </DialogTitle>
        <DialogContent
          sx={{
            padding: (theme) => theme.spacing(1, 5),
          }}
        >
          <TextField
            autoFocus
            error={nameError}
            fullWidth
            label={(locale === 'zhCN' && '用户名') || 'Name'}
            margin={'normal'}
            onChange={handleNameChange}
            type={'text'}
            variant={'outlined'}
          />
          <TextField
            error={passwordError}
            fullWidth
            label={(locale === 'zhCN' && '密码') || 'Password'}
            margin={'normal'}
            onChange={handlePasswordChange}
            type={'password'}
            variant={'outlined'}
          />
        </DialogContent>
        <DialogActions
          sx={{
            padding: (theme) => theme.spacing(1, 5, 6, 5),
          }}
        >
          <Button
            color={'primary'}
            fullWidth
            onClick={handleActionsClick}
            size={'large'}
            variant={'contained'}
          >
            {subtitle}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default Login;
