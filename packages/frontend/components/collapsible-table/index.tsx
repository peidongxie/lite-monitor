import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  type TableCellProps,
  type TableProps,
} from '@mui/material';
import {
  useCallback,
  useState,
  type ChangeEvent,
  type FC,
  type Key,
  type MouseEvent,
  type ReactNode,
} from 'react';
import CollapsibleTableRow from './collapsible-table-row';

interface CollapsibleTableProps {
  body: Record<Key, TableCellProps>[];
  collapse?: ReactNode[];
  head: ({ key: Key } & TableCellProps)[];
  tableProps?: TableProps;
}

const CollapsibleTable: FC<CollapsibleTableProps> = (props) => {
  const { body, collapse, head, tableProps } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = useCallback(
    (event: MouseEvent<HTMLButtonElement> | null, page: number) => {
      setPage(page);
    },
    [],
  );
  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  return (
    <TableContainer>
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
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
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
