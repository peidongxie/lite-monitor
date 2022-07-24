import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import {
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  type TableCellProps,
} from '@mui/material';
import {
  Fragment,
  useCallback,
  useState,
  type FC,
  type Key,
  type ReactNode,
} from 'react';

interface CollapsibleTableRowProps {
  collapse?: ReactNode;
  head: ({ key: Key } & TableCellProps)[];
  row: Record<Key, TableCellProps>;
}

const CollapsibleTableRow: FC<CollapsibleTableRowProps> = (props) => {
  const { collapse, head, row } = props;
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  return (
    <Fragment>
      <TableRow
        sx={{
          '& > *': {
            borderBottom: 'unset',
          },
        }}
      >
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
      <TableRow>
        <TableCell
          colSpan={head.length + Number(Boolean(collapse))}
          sx={{
            padding: (theme) => theme.spacing(0, 2),
          }}
        >
          <Collapse in={open}>{collapse}</Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default CollapsibleTableRow;
