import { GoATable, GoATableSortHeader } from '@abgov/react-components';
import styles from '@/features/process-invoice/tabs/invoice-cost-details-table.module.scss';
import { yearMonthDay } from '@/common/dates';
import { convertToCurrency } from '@/common/currency';
import { ITimeReportDetailsTableRowData, getFireNumberRow } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import { useState, useEffect } from 'react';

const { container, tableContainer } = styles;
interface IRowItem extends ITimeReportDetailsTableRowData {
  row: number;
}
interface InvoiceCostDataTableProps {
  data: ITimeReportDetailsTableRowData[];
}
const InvoiceCostDataTable: React.FC<InvoiceCostDataTableProps> = (props) => {
  const [rowData, setRowData] = useState<IRowItem[]>([]);
  useEffect(() => {
    if (props.data)
      setRowData(
        props.data.slice().map((x, i) => {
          const row: IRowItem = { row: i + 1, ...x };
          return row;
        }),
      );
  }, [props.data]);

  function sortData(sortBy: string, sortDir: number) {
    const data = [...rowData];

    data.sort((a: IRowItem, b: IRowItem) => {
      const varA = a[sortBy as keyof IRowItem];
      const varB = b[sortBy as keyof IRowItem];
      if (typeof varA === 'string' && typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    setRowData(
      data.map((x, i) => {
        const row: IRowItem = { row: i + 1, ...x };
        return row;
      }),
    );
  }

  return (
    <div className={container}>
      <div className={tableContainer}>
        <GoATable onSort={sortData} width='100%'>
          <thead>
            <tr>
              <th></th>
              <th>
                <GoATableSortHeader name={'flightReportDate'}>Date</GoATableSortHeader>
              </th>
              <th>Reg no.</th>
              <th>Report no.</th>
              <th>AO02 no.</th>
              <th>Rate type</th>
              <th>
                <GoATableSortHeader name={'noOfUnits'}>No. of units</GoATableSortHeader>
              </th>
              <th>Rate unit</th>
              <th>
                <GoATableSortHeader name={'ratePerUnit'}>Rate / unit</GoATableSortHeader>
              </th>
              <th>
                <GoATableSortHeader name={'cost'}>Cost</GoATableSortHeader>
              </th>
              <th>Internal order</th>
              <th>Cost centre</th>
              <th>Fund</th>
              <th>G/L acct</th>
              <th>Fire no.</th>
            </tr>
          </thead>
          <tbody>
            {rowData.map((x, index) => (
              <tr key={index}>
                <td>{x.row}</td>
                <td>{yearMonthDay(x.flightReportDate)}</td>
                <td>{x.contractRegistrationName}</td>
                <td>{x.flightReportId}</td>
                <td>{x.ao02Number}</td>
                <td>{x.rateType}</td>
                <td>{x.noOfUnits}</td>
                <td>{x.rateUnit}</td>
                <td>{convertToCurrency(x.ratePerUnit)}</td>
                <td>{convertToCurrency(x.cost)}</td>
                <td>{x.internalOrder}</td>
                <td>{x.costCenter}</td>
                <td>{x.fund}</td>
                <td>{x.account}</td>
                <td>{getFireNumberRow(x)}</td>
              </tr>
            ))}
          </tbody>
        </GoATable>
      </div>
    </div>
  );
};
export default InvoiceCostDataTable;
