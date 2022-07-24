import { SvgIcon, type SvgIconProps } from '@mui/material';
import { type FC } from 'react';

interface LogoProps extends SvgIconProps {
  viewBox?: '0 0 576 512';
}

const Logo: FC<LogoProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox={'0 0 576 512'}>
      <path
        d='
          M 480 96
          H 96
          v 160
          h 100.95
          c 3.03 0 5.8 1.71 7.15 4.42
          l 19.9 39.8 49.69 -99.38
          c 5.9 -11.79 22.72 -11.79 28.62 0
          L 329.89 256
          H 400
          c 8.84 0 16 7.16 16 16
          s -7.16 16-16 16
          h -89.89
          L 288 243.78
          l -49.69 99.38
          c -5.9 11.79 -22.72 11.79 -28.62 0
          L 182.11 288
          H 96
          v 128
          h 384
          V 96
          z
          m 48-96
          H 48
          C 21.49 0 0 21.49 0 48
          v 416
          c 0 26.51 21.49 48 48 48
          h 480
          c 26.51 0 48 -21.49 48 -48
          V 48
          c 0 -26.51 -21.49 -48 -48 -48
          z
          m -16 448
          H 64
          V 64
          h 448
          v 384
          z
        '
      />
    </SvgIcon>
  );
};

export default Logo;
