import Snackbar, { SnackbarCloseReason } from '@material-ui/core/Snackbar';
import Alert, { Color } from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { FC, SyntheticEvent, useCallback } from 'react';

interface AlertProps {
  duration?: number;
  message: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  severity?: Color;
}

const useStyles = makeStyles((theme) => ({
  root: {},
  alert: {
    backgroundColor: theme.palette.grey[50],
  },
}));

const Alertbar: FC<AlertProps> = (props) => {
  const { duration, message, open, severity, setOpen } = props;
  const handleClose = useCallback(
    (event: SyntheticEvent<Element, Event>, reason?: SnackbarCloseReason) => {
      if (reason !== 'clickaway') {
        setOpen(false);
      }
    },
    [setOpen],
  );
  const classes = useStyles();
  return (
    <Snackbar
      autoHideDuration={duration || 3000}
      className={classes.root}
      onClose={handleClose}
      open={open}
    >
      <Alert
        className={classes.alert}
        onClose={handleClose}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Alertbar;
