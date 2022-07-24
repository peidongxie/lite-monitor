import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Typography,
  type ButtonProps,
  type SxProps,
  type Theme,
} from '@mui/material';
import {
  useMemo,
  type FC,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { useLocale } from '../../utils/theme';

interface BriefCardProps {
  children?: ReactNode;
  className?: string;
  icon: ReactNode;
  leftNum: number;
  leftNumColor?: ButtonProps['color'];
  leftText: string;
  onActionClick?: MouseEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  rightNum: number;
  rightNumColor?: ButtonProps['color'];
  rightText: string;
  subtitle?: string;
  sx?: SxProps<Theme>;
  title: string;
}

const BriefCard: FC<BriefCardProps> = (props) => {
  const {
    children,
    icon,
    leftNum,
    leftNumColor,
    leftText,
    onActionClick,
    onClick,
    rightNum,
    rightNumColor,
    rightText,
    subtitle,
    sx,
    title,
  } = props;
  const [locale] = useLocale();
  const avatar = useMemo(() => {
    return (
      <Avatar
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) =>
            theme.palette.getContrastText(theme.palette.primary.main),
        }}
      >
        {icon}
      </Avatar>
    );
  }, [icon]);

  return (
    <Card
      onClick={onClick}
      sx={{
        padding: (theme) => theme.spacing(2, 3),
        width: 400,
        ...sx,
      }}
    >
      <CardHeader
        avatar={avatar}
        title={title}
        subheader={subtitle}
        sx={{
          padding: (theme) => theme.spacing(1, 0),
        }}
      />
      <CardContent
        sx={{
          padding: (theme) => theme.spacing(1, 0, 1, 0),
          display: 'flex',
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography color={'textSecondary'} gutterBottom variant={'caption'}>
            {leftText}
          </Typography>
          <Box>
            <Button
              color={leftNumColor || 'inherit'}
              size={'large'}
              style={{ paddingBottom: 0, paddingTop: 0, fontSize: 24 }}
            >
              {leftNum.toLocaleString()}
            </Button>
          </Box>
        </Container>
        <Divider orientation={'vertical'} flexItem />
        <Container>
          <Typography color={'textSecondary'} gutterBottom variant={'caption'}>
            {rightText}
          </Typography>
          <Box>
            <Button
              color={rightNumColor || 'inherit'}
              size={'large'}
              style={{ paddingBottom: 0, paddingTop: 0, fontSize: 24 }}
            >
              {rightNum.toLocaleString()}
            </Button>
          </Box>
        </Container>
      </CardContent>
      <CardActions
        sx={{
          padding: 0,
          justifyContent: 'space-between',
        }}
      >
        {children}
        <Button
          color={'primary'}
          endIcon={<NavigateNextIcon />}
          onClick={onActionClick}
        >
          {(locale === 'zhCN' && '更多详情') || 'More details'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default BriefCard;
