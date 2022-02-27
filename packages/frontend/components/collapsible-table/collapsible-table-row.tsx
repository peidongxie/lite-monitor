import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { FC, Fragment, Key, ReactNode, useCallback, useState } from 'react';

interface CollapsibleTableRowProps {
  collapse?: ReactNode;
  head: ({ key: Key } & TableCellProps)[];
  row: Record<Key, TableCellProps>;
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  row: {},
  cell: {
    padding: theme.spacing(0, 2),
  },
}));

const CollapsibleTableRow: FC<CollapsibleTableRowProps> = (props) => {
  const { collapse, head, row } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  return (
    <Fragment>
      <TableRow className={classes.root}>
        {collapse && (
          <TableCell>
            <IconButton onClick={handleClick} size={'small'}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {head.map((value) => (
          <TableCell key={value.key} {...row[value.key]} />
        ))}
      </TableRow>
      <TableRow className={classes.row}>
        <TableCell
          className={classes.cell}
          colSpan={head.length + Number(Boolean(collapse))}
        >
          <Collapse in={open}>{collapse}</Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default CollapsibleTableRow;
