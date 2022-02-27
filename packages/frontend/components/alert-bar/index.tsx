import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert, { Color } from '@mui/lab/Alert';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import { FC, SyntheticEvent, useCallback } from 'react';

interface AlertBarProps {
  className?: string;
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

const AlertBar: FC<AlertBarProps> = (props) => {
  const { className, duration, message, open, severity, setOpen } = props;
  const classes = useStyles();

  const handleClose = useCallback(
    (event: SyntheticEvent<Element, Event>, reason?: SnackbarCloseReason) => {
      if (reason !== 'clickaway') {
        setOpen(false);
      }
    },
    [setOpen],
  );

  return (
    <Snackbar
      autoHideDuration={duration || 3000}
      className={clsx(classes.root, className)}
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

export default AlertBar;
