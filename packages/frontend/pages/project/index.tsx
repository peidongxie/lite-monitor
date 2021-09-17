import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CloudIcon from '@material-ui/icons/Cloud';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';
import WebIcon from '@material-ui/icons/Web';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import useSWR from 'swr';
import BriefCard from '../../components/brief-card';
import { useAlert } from '../../utils/alert';
import { copy } from '../../utils/clipboard';
import { jsonFetcher } from '../../utils/fetcher';
import { useLocale } from '../../utils/locale';

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

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 4),
    width: '100%',
    marginTop: theme.spacing(8),
    display: 'grid',
    justifyContent: 'center',
    gridGap: theme.spacing(3),
    gridTemplateColumns: 'repeat(auto-fill,400px)',
  },
}));

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
  const locale = useLocale();
  const router = useRouter();
  const classes = useStyles();
  const projects = useProjects('/api/project/summary');
  const message =
    (locale === 'zhCN' && 'Token 已复制') || 'The token has been copied';

  const alert = useAlert(message, 'info');
  const wrapActionClick = (name: string) => () => {
    router.push('/project/error?name=' + name);
  };
  const wrapButtonClick = (token: string) => () => {
    copy(token);
    alert();
  };

  useEffect(() => {
    router.prefetch('/project/error');
  }, [router]);

  return (
    <Container className={classes.root} maxWidth={false}>
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
