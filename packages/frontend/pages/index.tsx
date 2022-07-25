import { Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, type FC } from 'react';
import Footer from '../components/footer';
import { useLocale } from '../utils/theme';

const HomePage: FC = () => {
  const [locale] = useLocale();
  const router = useRouter();

  const handleEntryClick = useCallback(() => {
    router.push('/project');
  }, [router]);

  useEffect(() => {
    router.prefetch('/project');
  }, [router]);

  return (
    <Fragment>
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          width: '100%',
          height: 'calc(100% - 128px)',
          marginTop: (theme) => theme.spacing(8),
          alignItems: 'center',
          backgroundImage: 'url(./bg.svg)',
          backgroundPosition: 'right 20% top 50%',
          backgroundSize: '40%',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <Container
          disableGutters
          sx={{
            margin: 'auto 20%',
            width: 'auto',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
            }}
            variant={'h3'}
            variantMapping={{ h3: 'h1' }}
          >
            Lite Monitor
          </Typography>
          <Typography
            sx={{
              margin: (theme) => theme.spacing(1, 0),
            }}
            variant={'h5'}
            variantMapping={{ h5: 'p' }}
          >
            {(locale === 'zhCN' && '跨 平 台 应 用 监 控 系 统') ||
              'Cross-platform App Monitoring System'}
          </Typography>
          <Button
            color={'primary'}
            onClick={handleEntryClick}
            size={'large'}
            sx={{
              padding: (theme) => theme.spacing(1, 8),
              width: 224,
              margin: (theme) => theme.spacing(3, 0),
              fontSize: 18,
              fontWeight: 600,
            }}
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
