import Table, { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';
import {
  ChangeEvent,
  FC,
  Key,
  MouseEvent,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import CollapsibleTableRow from './collapsible-table-row';

interface CollapsibleTableProps {
  body: Record<Key, TableCellProps>[];
  collapse?: ReactNode[];
  head: ({ key: Key } & TableCellProps)[];
  tableProps?: TableProps;
}

const useStyles = makeStyles(() => ({
  root: {},
}));

const CollapsibleTable: FC<CollapsibleTableProps> = (props) => {
  const { body, collapse, head, tableProps } = props;
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = useCallback(
    (event: MouseEvent<HTMLButtonElement> | null, page: number) => {
      setPage(page);
    },
    [],
  );
  const handleChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  return (
    <TableContainer className={classes.root}>
      <Table {...tableProps}>
        <TableHead>
          <TableRow>
            {collapse && <TableCell />}
            {head.map((value, index) => (
              <TableCell {...value} key={index} />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {body
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <CollapsibleTableRow
                collapse={collapse?.[index]}
                head={head}
                key={index}
                row={row}
              />
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={body.length}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
              rowsPerPage={rowsPerPage}
              style={{ borderBottomWidth: 0 }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default CollapsibleTable;
