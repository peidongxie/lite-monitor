import { Alert, Snackbar, type SnackbarCloseReason } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import { useCallback, type FC, type SyntheticEvent } from 'react';
import { useAlert, useCloseAlert } from '../../utils/alert';

interface AlertBarProps {
  className?: string;
  duration?: number;
}

const useStyles = makeStyles((theme) => ({
  root: {},
  alert: {
    backgroundColor: theme.palette.grey[50],
  },
}));

const AlertBar: FC<AlertBarProps> = (props) => {
  const { className, duration } = props;
  const { message, open, severity } = useAlert();
  const closeAlert = useCloseAlert();
  const classes = useStyles();

  const handleClose = useCallback(
    (
      event: Event | SyntheticEvent<Element, Event>,
      reason?: SnackbarCloseReason,
    ) => {
      if (reason !== 'clickaway') closeAlert();
    },
    [closeAlert],
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
