import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {
  ChangeEventHandler,
  FC,
  Fragment,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Label from '../label';
import { useAlert } from '../../utils/alert';
import { jsonFetcher } from '../../utils/fetcher';
import { useLocale } from '../../utils/locale';
import { useRefState } from '../../utils/store';

interface LoginProps {
  link: string;
}

const useStyles = makeStyles((theme) => ({
  button: {},
  icon: {},
  showName: {
    width: 64,
    // display: 'inline-block',
  },
  popover: {},
  list: {
    padding: 0,
  },
  dialog: {},
  title: {
    padding: theme.spacing(6, 5, 1, 5),
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing(1, 5),
  },
  actions: {
    padding: theme.spacing(1, 5, 6, 5),
  },
}));

const Login: FC<LoginProps> = (props) => {
  const { link } = props;
  const [showName, setShowName] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameRef, setName] = useRefState('');
  const [passwordRef, setPassword] = useRefState('');
  const locale = useLocale();
  const classes = useStyles();
  const subtitle = (locale === 'zhCN' && '登 录') || 'Log In';
  const message = (locale === 'zhCN' && '登录失败') || 'Log in failed';

  const alert = useAlert(message, 'error');
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
    async (body: { name: string; password: string } | { token: string }) => {
      const user: {
        showName: string;
        token: string;
      } = await jsonFetcher(link, 'POST', body);
      const { showName, token } = user;
      localStorage.setItem('token', token);
      setShowName(showName);
      handleDialogClose();
    },
    [link, handleDialogClose],
  );
  const handleActionsClick = useCallback(async () => {
    const name = nameRef.current;
    const password = passwordRef.current;
    if (!name) setNameError(true);
    if (!password) setPasswordError(true);
    if (name && password) handleLogin({ name, password }).catch(alert);
  }, [nameRef, passwordRef, handleLogin, alert]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) handleLogin({ token });
  }, [handleLogin]);

  return (
    <Fragment>
      <Button
        className={classes.button}
        color={'primary'}
        onClick={handleButtonClick}
      >
        <AccountCircleIcon className={classes.icon} />
        <Typography className={classes.showName} variant={'subtitle2'}>
          {showName || subtitle}
        </Typography>
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
          <ListItem button={true} onClick={handleItemClick}>
            <ListItemText primaryTypographyProps={{ color: 'error' }}>
              {(locale === 'zhCN' && '退出登录') || 'Log out'}
            </ListItemText>
          </ListItem>
        </List>
      </Popover>
      <Dialog
        className={classes.dialog}
        open={open}
        onClose={handleDialogClose}
      >
        <DialogTitle className={classes.title}>
          <Label title={'Lite Monitor'} />
        </DialogTitle>
        <DialogContent className={classes.content}>
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
        <DialogActions className={classes.actions}>
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
