import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  type SxProps,
  type Theme,
} from '@mui/material';
import {
  AccountTree as AccountTreeIcon,
  Explore as ExploreIcon,
  Http as HttpIcon,
  NotificationImportant as NotificationImportantIcon,
  Speed as SpeedIcon,
  Widgets as WidgetsIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useEffect, useMemo, type FC, type ReactElement } from 'react';
import { jsonFetcher } from '../../utils/fetcher';
import { useLocale } from '../../utils/theme';
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
  selectedName: string;
  sx?: SxProps<Theme>;
}

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
  const [locale] = useLocale();
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

const iconMap: Record<string, ReactElement> = {
  default: <SpeedIcon />,
  error: <NotificationImportantIcon />,
  resource: <WidgetsIcon />,
  message: <HttpIcon />,
  component: <AccountTreeIcon />,
  access: <ExploreIcon />,
};

const SideDrawer: FC<SideDrawerProps> = (props) => {
  const { api, selectedName, sx } = props;
  const router = useRouter();
  const name = useName();
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
    <Drawer
      sx={{
        flexShrink: 0,
        ...sx,
      }}
      variant={'permanent'}
    >
      <Toolbar />
      <List
        sx={{
          width: 256,
        }}
      >
        {menu.map((item) => (
          <ListItem
            button
            key={item.name}
            onClick={wrapItemClick(item.link)}
            sx={{
              color: (theme) =>
                item.selected ? theme.palette.primary.main : null,
            }}
          >
            <ListItemIcon
              sx={{
                color: 'inherit',
                justifyContent: 'center',
                minWidth: 48,
              }}
            >
              {iconMap[item.type] || iconMap.default}
            </ListItemIcon>
            <ListItemText>{item.showName}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideDrawer; // Coupling with business logic
