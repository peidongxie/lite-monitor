import {
  Alert,
  Snackbar,
  type SnackbarCloseReason,
  type SxProps,
  type Theme,
} from '@mui/material';
import { useCallback, type FC, type SyntheticEvent } from 'react';
import { useAlert, useCloseAlert } from '../../utils/alert';

interface AlertBarProps {
  duration?: number;
  sx?: SxProps<Theme>;
}

const AlertBar: FC<AlertBarProps> = (props) => {
  const { duration, sx } = props;
  const { message, open, severity } = useAlert();
  const closeAlert = useCloseAlert();

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
      onClose={handleClose}
      open={open}
      sx={{
        ...sx,
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          backgroundColor: (theme) => theme.palette.grey[50],
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertBar;
