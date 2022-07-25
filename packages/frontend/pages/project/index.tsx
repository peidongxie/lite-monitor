import { Button, Container } from '@mui/material';
import {
  Cloud as CloudIcon,
  FileCopy as FileCopyIcon,
  Help as HelpIcon,
  Web as WebIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useEffect, type FC } from 'react';
import useSWR from 'swr';
import BriefCard from '../../components/brief-card';
import { useOpenAlert } from '../../utils/alert';
import { copy } from '../../utils/clipboard';
import { jsonFetcher } from '../../utils/fetcher';
import { useLocale } from '../../utils/theme';

enum ProjectType {
  UNKNOWN = 0,
  WEB = 1,
  NODE = 2,
}

interface ProjectSummary {
  name: string;
  showName: string;
  type: ProjectType;
  token: string;
  event: number;
  error: number;
}

const useProjects = (api: string) => {
  const { data, error } = useSWR<ProjectSummary[]>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const icons = [
  <HelpIcon key={0} />,
  <CloudIcon key={1} />,
  <WebIcon key={2} />,
];

const ProjectPage: FC = () => {
  const [locale] = useLocale();
  const router = useRouter();
  const projects = useProjects('/api/project/summary');

  const openAlert = useOpenAlert();
  const wrapActionClick = (name: string) => () => {
    router.push('/project/error?name=' + name);
  };
  const wrapButtonClick = (token: string) => async () => {
    const success = await copy(token);
    if (success) {
      openAlert(
        (locale === 'zhCN' && '已复制 token') || 'The token has been copied',
        'info',
      );
    } else {
      openAlert(
        (locale === 'zhCN' && '未能复制 token') || 'The token was not copied',
        'warning',
      );
    }
  };

  useEffect(() => {
    router.prefetch('/project/error');
  }, [router]);

  return (
    <Container
      maxWidth={false}
      sx={{
        padding: (theme) => theme.spacing(3, 4),
        width: '100%',
        marginTop: (theme) => theme.spacing(8),
        display: 'grid',
        justifyContent: 'center',
        gridGap: (theme) => theme.spacing(3),
        gridTemplateColumns: 'repeat(auto-fill,400px)',
      }}
    >
      {(Array.isArray(projects) ? projects : []).map((project) => (
        <BriefCard
          key={project.name}
          icon={icons[project.type]}
          leftNum={project.error}
          leftNumColor={'secondary'}
          leftText={(locale === 'zhCN' && '最近错误数') || 'Recent Errors'}
          onActionClick={wrapActionClick(project.name)}
          rightNum={project.event}
          rightNumColor={'primary'}
          rightText={(locale === 'zhCN' && '最近事件数') || 'Recent Events'}
          subtitle={project.name}
          title={project.showName}
        >
          <Button
            onClick={wrapButtonClick(project.token)}
            size={'small'}
            startIcon={<FileCopyIcon />}
          >
            {(locale === 'zhCN' && '复制 Token') || 'Copy the token'}
          </Button>
        </BriefCard>
      ))}
    </Container>
  );
};

export default ProjectPage;
