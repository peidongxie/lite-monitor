import { GitHub as GitHubIcon } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { type FC } from 'react';

interface FooterProps {
  sx?: SxProps<Theme>;
  year?: number;
}

const Footer: FC<FooterProps> = (props) => {
  const { sx, year } = props;

  return (
    <Box
      component={'footer'}
      sx={{
        width: '100%',
        height: 64,
        borderTopColor: (theme) => theme.palette.grey[200],
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        ...sx,
      }}
    >
      <Typography
        color={'textSecondary'}
        sx={{
          height: 48,
          margin: (theme) => theme.spacing(1, 0),
          color: (theme) => theme.palette.grey[700],
          textAlign: 'center',
        }}
        variant={'body2'}
      >
        {'Copyright @ '}
        {year || new Date().getFullYear()}
        <IconButton
          color={'inherit'}
          component={'a'}
          href={'https://github.com/peidongxie/lite-monitor'}
          size={'small'}
          sx={{
            margin: '7px 8px 11px 8px',
          }}
        >
          <GitHubIcon />
        </IconButton>
      </Typography>
    </Box>
  );
};

export default Footer;
