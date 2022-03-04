import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { FC, Fragment, useCallback, useEffect } from 'react';
import Footer from '../components/footer';
import { useLocale } from '../utils/theme';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 'calc(100% - 128px)',
    marginTop: theme.spacing(8),
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
    width: 224,
    margin: theme.spacing(3, 0),
    fontSize: 18,
    fontWeight: 600,
  },
}));

const HomePage: FC = () => {
  const [locale] = useLocale();
  const router = useRouter();
  const classes = useStyles();

  const handleEntryClick = useCallback(() => {
    router.push('/project');
  }, [router]);

  useEffect(() => {
    router.prefetch('/project');
  }, [router]);

  return (
    <Fragment>
      <Container className={classes.root} disableGutters maxWidth={false}>
        <Container className={classes.main} disableGutters>
          <Typography
            className={classes.name}
            variant={'h3'}
            variantMapping={{ h3: 'h1' }}
          >
            Lite Monitor
          </Typography>
          <Typography
            className={classes.description}
            variant={'h5'}
            variantMapping={{ h5: 'p' }}
          >
            {(locale === 'zhCN' && '跨 平 台 应 用 监 控 系 统') ||
              'Cross-platform App Monitoring System'}
          </Typography>
          <Button
            className={classes.entry}
            color={'primary'}
            onClick={handleEntryClick}
            size={'large'}
            variant={'contained'}
          >
            {(locale === 'zhCN' && '立 即 使 用') || 'Try it now'}
          </Button>
        </Container>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default HomePage;
