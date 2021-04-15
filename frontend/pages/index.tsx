import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { FC, Fragment } from 'react';
import Footer from '../components/footer';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'calc(100% - 128px)',
    alignItems: 'center',
    backgroundImage: 'url(./bg.svg)',
    backgroundPosition: 'right 20% top 50%',
    backgroundSize: '40%',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexWrap: 'wrap',
  },
  main: {
    margin: 'auto 20%',
    width: 'auto',
  },
  name: {
    fontWeight: 600,
  },
  description: {
    margin: theme.spacing(1, 0),
  },
  entry: {
    padding: theme.spacing(1, 8),
    margin: theme.spacing(3, 0),
    fontSize: 18,
    fontWeight: 600,
  },
}));

const HomePage: FC = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Container
        className={classes.root}
        disableGutters={true}
        maxWidth={false}
      >
        <Container className={classes.main} disableGutters={true}>
          <Typography className={classes.name} variant={'h3'}>
            Lite Monitor
          </Typography>
          <Typography className={classes.description} variant={'h5'}>
            跨端应用监控系统
          </Typography>
          <Button
            className={classes.entry}
            color={'primary'}
            size={'large'}
            variant={'contained'}
          >
            立 即 使 用
          </Button>
        </Container>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default HomePage;
