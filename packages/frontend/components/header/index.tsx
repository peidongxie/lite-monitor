import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useSWR from 'swr';
import ComboBox from '../combo-box';
import Label from '../label';
import Lang from '../lang';
import Login from '../login';
import { Locale } from '../../utils/locale';
import { jsonFetcher } from '../../utils/fetcher';

interface HeaderProps {
  projectInfoApi: string;
  setLocale: Dispatch<SetStateAction<Locale>>;
  userAuthApi: string;
}

enum ProjectType {
  UNKNOWN = 0,
  WEB = 1,
  NODE = 2,
}

interface ProjectInfo {
  name: string;
  showName: string;
  type: ProjectType;
  token: string;
}

const useProjects = (api: string) => {
  const { data, error } = useSWR<ProjectInfo[]>(api, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: 64,
    zIndex: theme.zIndex.drawer + 1,
  },
  label: {},
  projects: {
    padding: theme.spacing(0, 1),
    width: 256,
    marginLeft: theme.spacing(6),
  },
}));

const Header: FC<HeaderProps> = (props) => {
  const { projectInfoApi, setLocale, userAuthApi } = props;
  const router = useRouter();
  const classes = useStyles();
  const [project, setProject] = useState<ProjectInfo>();
  const projects = useProjects(projectInfoApi);
  const option = useMemo(() => project || null, [project]);
  const options = useMemo(
    () => (Array.isArray(projects) ? projects : []),
    [projects],
  );

  const handleLabelClick = useCallback(() => {
    router.push('/');
  }, [router]);
  const handleComboBoxSelect = useCallback(
    (option: ProjectInfo) => {
      router.push(`/project/error?name=` + option.name);
    },
    [router],
  );

  useEffect(() => {
    const findOption = (option) => option.name === router.query.name;
    setProject(options.find(findOption));
  }, [options, router]);
  useEffect(() => {
    router.prefetch('/');
    router.prefetch('/project/error');
  }, [router]);

  return (
    <AppBar className={classes.root} color={'default'} position={'fixed'}>
      <Toolbar>
        <Label
          className={classes.label}
          onClick={handleLabelClick}
          title={'Lite Monitor'}
        />
        <ComboBox
          className={classes.projects}
          onSelect={handleComboBoxSelect}
          option={option}
          options={options}
        />
        <span style={{ flexGrow: 1 }} />
        <Login api={userAuthApi} />
        <Lang setLocale={setLocale} />
      </Toolbar>
    </AppBar>
  );
};

export default Header; // Coupling with business logic
