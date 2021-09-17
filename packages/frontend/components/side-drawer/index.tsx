import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ExploreIcon from '@material-ui/icons/Explore';
import HttpIcon from '@material-ui/icons/Http';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import SpeedIcon from '@material-ui/icons/Speed';
import WidgetsIcon from '@material-ui/icons/Widgets';
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
