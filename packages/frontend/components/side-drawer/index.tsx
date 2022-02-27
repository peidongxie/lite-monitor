import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from '@mui/styles';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ExploreIcon from '@mui/icons-material/Explore';
import HttpIcon from '@mui/icons-material/Http';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import SpeedIcon from '@mui/icons-material/Speed';
import WidgetsIcon from '@mui/icons-material/Widgets';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { FC, useEffect, useMemo } from 'react';
import { jsonFetcher } from '../../utils/fetcher';
import { useLocale } from '../../utils/locale';
import { useName } from '../../utils/router';

interface ProjectMenuItem {
  name: string;
  type: string;
  showNameMap: {
    zhCN: string;
    enUS: string;
  };
}

interface SideDrawerProps {
  api: string;
  className?: string;
  selectedName: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
  },
  list: {
    width: 256,
  },
  item: {},
  selectedItem: {
    color: theme.palette.primary.main,
  },
  icon: {
    color: 'inherit',
    justifyContent: 'center',
    minWidth: 48,
  },
  text: {},
}));

const useProjectMenu = (api: string) => {
  const { data, error } = useSWR<Record<string, ProjectMenuItem[]>>(
    api,
    jsonFetcher,
  );
  if (error) return typeof error === 'number' ? error : null;
  return data;
};

const useMenu = (api: string, selectedName: string) => {
  const name = useName();
  const locale = useLocale();
  const menu = useProjectMenu(`${api}?name=${name}`);
  return useMemo(() => {
    if (!(menu instanceof Object)) return [];
    return menu[name].map((value) => ({
      name: value.name,
      type: value.type,
      showName:
        (locale === 'zhCN' && value.showNameMap.zhCN) || value.showNameMap.enUS,
      link: '/project/' + value.name,
      selected: value.name === selectedName,
    }));
  }, [menu, name, locale, selectedName]);
};

const iconMap = {
  default: <SpeedIcon />,
  error: <NotificationImportantIcon />,
  resource: <WidgetsIcon />,
  message: <HttpIcon />,
  component: <AccountTreeIcon />,
  access: <ExploreIcon />,
};

const SideDrawer: FC<SideDrawerProps> = (props) => {
  const { api, className, selectedName } = props;
  const router = useRouter();
  const name = useName();
  const classes = useStyles();
  const menu = useMenu(api, selectedName);

  const wrapItemClick = (link: string) => () => {
    router.push(`${link}?name=${name}`);
  };

  useEffect(() => {
    for (const item of menu) {
      router.prefetch(item.link);
    }
  }, [menu, router]);

  return (
    <Drawer className={clsx(classes.root, className)} variant={'permanent'}>
      <Toolbar />
      <List className={classes.list}>
        {menu.map((item) => (
          <ListItem
            button
            className={clsx(
              classes.item,
              item.selected && classes.selectedItem,
            )}
            key={item.name}
            onClick={wrapItemClick(item.link)}
          >
            <ListItemIcon className={classes.icon}>
              {iconMap[item.type] || iconMap.default}
            </ListItemIcon>
            <ListItemText className={classes.text}>
              {item.showName}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideDrawer; // Coupling with business logic
