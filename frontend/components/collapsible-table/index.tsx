import Table, { TableProps } from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme) => ({
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
            {head.map((value) => (
              <TableCell {...value} />
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
