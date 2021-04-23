import { PropTypes } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import clsx from 'clsx';
import { FC, MouseEventHandler, ReactNode, useMemo } from 'react';

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
    // margin: theme.spacing(2),
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
          {'更多详情'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default BriefCard;
