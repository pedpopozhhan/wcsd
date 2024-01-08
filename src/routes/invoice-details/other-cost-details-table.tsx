import {
  GoAButton,
  GoATable,
  GoATableSortHeader,
} from '@abgov/react-components';
import styles from './other-cost-details-table.module.scss';
import { yearMonthDay } from '@/common/dates';
import { IOtherCostTableRowData } from '@/interfaces/invoice-details/other-cost-table-row-data';
import { useEffect, useState } from 'react';
import { convertToCurrency } from '@/common/currency';

let {
  container,
  checkboxWrapper,
  buttonWrapper,
  tableContainer,
  stickyColumn,
  start,
  end,
  onTop,
} = styles;
class Row {
  index: number;
  data: IOtherCostTableRowData;
}
interface IOtherCostTableProps {
  data: IOtherCostTableRowData[];
  onAddUpdateRemoveOtherCost: (amountToAdjust: number) => any;
}
const OtherCostDetailsTable: React.FC<IOtherCostTableProps> = (props) => {
  const [rowData, setRowData] = useState<Row[]>([]);
  useEffect(() => {
    setRowData(
      props.data.slice().map((x, i) => {
        return {
          index: i,
          data: x,
        };
      })
    );
  }, [props.data]);

  // This reacts to the rowData changing
  useEffect(() => {}, [rowData]);

  function sortData(sortBy: string, sortDir: number) {
    const data = [...rowData];
    data.sort((a: any, b: any) => {
      const varA = a.data[sortBy];
      const varB = b.data[sortBy];
      if (typeof varA === 'string' || typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    setRowData(data);
  }

  function editSelectedOtherCost(row: Row) {}

  function removeSelectedOtherCost(row: Row) {}

  return (
    <div className={container}>
      <div className={tableContainer}>
        <GoATable onSort={sortData}>
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
              <th>Rate Type</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>No. of Units</th>
              <th>Cost</th>
              <th>GL Account No.</th>
              <th>Profit Centre</th>
              <th>Cost Centre</th>
              <th>Internal Order</th>
              <th>Fund</th>
              <th>Remarks</th>
              <th className={`${stickyColumn} ${end} ${onTop}`}></th>
            </tr>
          </thead>
          <tbody>
            {rowData.map((x, index) => (
              <tr key={index}>
                <td>{yearMonthDay(x.data.from)}</td>
                <td>{yearMonthDay(x.data.to)}</td>
                <td>{x.data.rateType}</td>
                <td>{x.data.unit}</td>
                <td>{convertToCurrency(x.data.ratePerUnit)}</td>
                <td>{x.data.numberOfUnits}</td>
                <td>{convertToCurrency(x.data.cost)}</td>
                <td>{x.data.glAccountNumber}</td>
                <td>{x.data.profitCentre}</td>
                <td>{x.data.costCentre}</td>
                <td>{x.data.internalOrder}</td>
                <td>{x.data.fund}</td>
                <td>{x.data.remarks}</td>
                <td className={`${stickyColumn} ${end}`}>
                  <div className={buttonWrapper}>
                    <GoAButton
                      size='compact'
                      type='secondary'
                      onClick={() => editSelectedOtherCost(x)}
                    >
                      {'Edit'}
                    </GoAButton>
                    <GoAButton
                      size='compact'
                      type='secondary'
                      onClick={() => removeSelectedOtherCost(x)}
                    >
                      {'Remove'}
                    </GoAButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </GoATable>
      </div>
    </div>
  );
};

export default OtherCostDetailsTable;
