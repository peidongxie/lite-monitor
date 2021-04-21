import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { CSSProperties, FC, MouseEventHandler } from 'react';
import clsx from 'clsx';
import Logo from '../logo';

interface LabelProps {
  className?: string;
  iconSize?: CSSProperties['fontSize'];
  gap?: CSSProperties['marginLeft'];
  link?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title: string;
  titleSize?: CSSProperties['fontSize'];
  titleWeight?: CSSProperties['fontWeight'];
}

const useStyles = makeStyles((theme) => ({
  root: {},
  logo: {
    fontSize: 36,
  },
  title: {
    fontWeight: 600,
    letterSpacing: '0.0075em',
    marginLeft: theme.spacing(1.5),
  },
}));

const Label: FC<LabelProps> = (props) => {
  const {
    className,
    iconSize,
    gap,
    link,
    onClick,
    title,
    titleSize,
    titleWeight,
  } = props;
  const classes = useStyles();
  return (
    <Button
      className={clsx(classes.root, className)}
      color={'primary'}
      onClick={onClick}
    >
      <Logo className={classes.logo} style={{ fontSize: iconSize }} />
      <Typography
        className={classes.title}
        style={{
          fontSize: titleSize,
          fontWeight: titleWeight,
          marginLeft: gap,
        }}
        variant={'h6'}
      >
        {link ? <Link href={link}>{title}</Link> : title}
      </Typography>
    </Button>
  );
};

export default Label;
