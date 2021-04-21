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
  setLocale: Dispatch<SetStateAction<Locale>>;
  title: string;
}

export enum ProjectType {
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

const useOptions = (link: string) => {
  const { data, error } = useSWR<ProjectInfo[]>(link, jsonFetcher);
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: 64,
  },
}));

const Header: FC<HeaderProps> = (props) => {
  const { setLocale, title } = props;
  const [option, setOption] = useState<ProjectInfo | null>(null);
  const options = useOptions('/api/project/info');
  const router = useRouter();
  const classes = useStyles();

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
    if (Array.isArray(options)) {
      const findOption = (option) => option.name === router.query.name;
      setOption(options.find(findOption) || null);
    }
  }, [options, router]);
  useEffect(() => {
    router.prefetch('/');
    router.prefetch('/project/error');
  }, [router]);

  return (
    <div className={classes.root}>
      <AppBar color={'default'} position='static'>
        <Toolbar>
          <Label onClick={handleLabelClick} title={title} />
          <ComboBox
            onSelect={handleComboBoxSelect}
            option={option}
            options={Array.isArray(options) ? options : []}
          />
          <span style={{ flexGrow: 1 }} />
          <Login link={'/api/user/auth'} />
          <Lang setLocale={setLocale} />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
