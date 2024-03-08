import { GoATable, GoATableSortHeader } from '@abgov/react-components';
import styles from '@/features/process-invoice/tabs/invoice-other-costs-table.module.scss';
import { yearMonthDay } from '@/common/dates';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { useEffect, useState } from 'react';
import { convertToCurrency } from '@/common/currency';

const { container, tableContainer } = styles;
class Row {
  index: number;
  data: IOtherCostTableRowData;
}
interface IOtherCostTableProps {
  data: IOtherCostTableRowData[];
}
const InvoiceOtherCostTable: React.FC<IOtherCostTableProps> = (props) => {
  const [rowData, setRowData] = useState<Row[]>([]);

  useEffect(() => {
    setRowData(
      props.data.slice().map((x, i) => {
        return {
          index: i,
          data: x,
        };
      }),
    );
  }, [props.data]);

  function sortData(sortBy: string, sortDir: number) {
    const data = [...rowData];

    data.sort((a: Row, b: Row) => {
      const varA = a.data[sortBy as keyof IOtherCostTableRowData];
      const varB = b.data[sortBy as keyof IOtherCostTableRowData];
      if (typeof varA === 'string' && typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    setRowData(data);
  }

  return (
    <div className={container}>
      <div className={tableContainer}>
        <GoATable onSort={sortData} width='100%'>
          <thead>
            <tr>
              <th>
                {' '}
                <GoATableSortHeader name={'from'}>From</GoATableSortHeader>{' '}
              </th>
              <th>
                {' '}
                <GoATableSortHeader name={'to'}>To</GoATableSortHeader>{' '}
              </th>
              <th>Rate type</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>No. of units</th>
              <th>Cost</th>
              <th>Internal order</th>
              <th>Cost centre</th>
              <th>Fund</th>
              <th>G/L acct</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {rowData.map((x, index) => (
              <tr key={index}>
                <td>{yearMonthDay(x.data.from)}</td>
                <td>{yearMonthDay(x.data.to)}</td>
                <td>{x.data.rateType}</td>
                <td>{x.data.rateUnit}</td>
                <td>{convertToCurrency(x.data.ratePerUnit)}</td>
                <td>{x.data.noOfUnits}</td>
                <td>{convertToCurrency(x.data.cost)}</td>
                <td>{x.data.internalOrder}</td>
                <td>{x.data.costCentre}</td>
                <td>{x.data.account}</td>
                <td>{x.data.fund}</td>
                <td>{x.data.remarks}</td>
              </tr>
            ))}
          </tbody>
        </GoATable>
      </div>
    </div>
  );
};

export default InvoiceOtherCostTable;
