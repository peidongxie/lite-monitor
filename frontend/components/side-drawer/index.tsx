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
import { FC, useEffect } from 'react';

interface MenuItem {
  name: string;
  type: string;
  showName: string;
  link: string;
  selected: boolean;
}

interface SideDrawerProps {
  className?: string;
  items: MenuItem[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
  },
  list: {
    width: 256,
  },
  item: {
    // paddingLeft: theme.spacing(1),
  },
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

const iconMap = {
  default: <SpeedIcon />,
  error: <NotificationImportantIcon />,
  resource: <WidgetsIcon />,
  message: <HttpIcon />,
  component: <AccountTreeIcon />,
  access: <ExploreIcon />,
};

const SideDrawer: FC<SideDrawerProps> = (props) => {
  const { className, items } = props;
  const router = useRouter();
  const classes = useStyles();

  const wrapItemClick = (link: string) => () => {
    router.push(`${link}?name=${router.query.name}`);
  };

  useEffect(() => {
    for (const item of items) {
      router.prefetch(item.link);
    }
  }, [items, router]);

  return (
    <Drawer className={clsx(classes.root, className)} variant={'permanent'}>
      <Toolbar />
      <List className={classes.list}>
        {items.map((item: MenuItem) => (
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
