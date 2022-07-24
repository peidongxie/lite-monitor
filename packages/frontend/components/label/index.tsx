import { Button, Typography, type SxProps, type Theme } from '@mui/material';
import { type CSSProperties, type FC, type MouseEventHandler } from 'react';
import Logo from '../logo';

interface LabelProps {
  gap?: CSSProperties['marginLeft'];
  iconSize?: CSSProperties['fontSize'];
  onClick?: MouseEventHandler<HTMLButtonElement>;
  sx?: SxProps<Theme>;
  title: string;
  titleSize?: CSSProperties['fontSize'];
  titleWeight?: CSSProperties['fontWeight'];
}

const Label: FC<LabelProps> = (props) => {
  const { gap, iconSize, onClick, sx, title, titleSize, titleWeight } = props;

  return (
    <Button color={'primary'} onClick={onClick} sx={{ ...sx }}>
      <Logo
        style={{ fontSize: iconSize }}
        sx={{
          fontSize: 36,
        }}
      />
      <Typography
        sx={{
          fontSize: titleSize,
          fontWeight: titleWeight || 600,
          letterSpacing: '0.0075em',
          marginLeft: (theme) => gap || theme.spacing(1.5),
        }}
        variant={'h6'}
      >
        {title}
      </Typography>
    </Button>
  );
};

export default Label;
