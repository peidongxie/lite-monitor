import { AppBar, Toolbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import useSWR from 'swr';
import ComboBox from '../combo-box';
import Label from '../label';
import Lang from '../lang';
import Login from '../login';
import { jsonFetcher } from '../../utils/fetcher';

interface HeaderProps {
  projectInfoApi: string;
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

const Header: FC<HeaderProps> = (props) => {
  const { projectInfoApi, userAuthApi } = props;
  const router = useRouter();
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
    (option: ProjectInfo | null) => {
      if (option) {
        router.push(`/project/error?name=` + option.name);
      }
    },
    [router],
  );

  useEffect(() => {
    setProject(options.find((option) => option.name === router.query.name));
  }, [options, router]);
  useEffect(() => {
    router.prefetch('/');
    router.prefetch('/project/error');
  }, [router]);

  return (
    <AppBar
      color={'default'}
      position={'fixed'}
      sx={{
        height: 64,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Label
          onClick={handleLabelClick}
          sx={{
            height: 64,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          title={'Lite Monitor'}
        />
        <ComboBox
          onSelect={handleComboBoxSelect}
          option={option}
          options={options}
          sx={{
            padding: (theme) => theme.spacing(0, 1),
            width: 256,
            marginLeft: (theme) => theme.spacing(6),
          }}
        />
        <span style={{ flexGrow: 1 }} />
        <Login api={userAuthApi} />
        <Lang />
      </Toolbar>
    </AppBar>
  );
};

export default Header; // Coupling with business logic
