import { PropTypes } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import clsx from 'clsx';
import { FC, MouseEventHandler, ReactNode, useMemo } from 'react';
import { useLocale } from '../../utils/theme';

interface BriefCardProps {
  children?: ReactNode;
  className?: string;
  icon: ReactNode;
  leftNum: number;
  leftNumColor?: PropTypes.Color;
  leftText: string;
  onActionClick?: MouseEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  rightNum: number;
  rightNumColor?: PropTypes.Color;
  rightText: string;
  subtitle?: string;
  title: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 3),
    width: 400,
  },
  header: {
    padding: theme.spacing(1, 0),
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  content: {
    padding: theme.spacing(1, 0, 1, 0),
    display: 'flex',
    textAlign: 'center',
  },
  actions: {
    padding: 0,
    justifyContent: 'space-between',
  },
}));

const BriefCard: FC<BriefCardProps> = (props) => {
  const {
    children,
    className,
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
    title,
  } = props;
  const [locale] = useLocale();
  const classes = useStyles();
  const avatar = useMemo(() => {
    return <Avatar className={classes.avatar}>{icon}</Avatar>;
  }, [classes, icon]);

  return (
    <Card className={clsx(classes.root, className)} onClick={onClick}>
      <CardHeader
        avatar={avatar}
        className={classes.header}
        title={title}
        subheader={subtitle}
      />
      <CardContent className={classes.content}>
        <Container>
          <Typography color={'textSecondary'} gutterBottom variant={'caption'}>
            {leftText}
          </Typography>
          <Box>
            <Button
              color={leftNumColor}
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
              color={rightNumColor}
              size={'large'}
              style={{ paddingBottom: 0, paddingTop: 0, fontSize: 24 }}
            >
              {rightNum.toLocaleString()}
            </Button>
          </Box>
        </Container>
      </CardContent>
      <CardActions className={classes.actions}>
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
