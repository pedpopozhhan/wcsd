import {
  GoAButton,
  GoACheckbox,
  GoATable,
  GoATableSortHeader,
} from '@abgov/react-components';
import styles from './details-table.module.scss';
import { yearMonthDay } from '@/common/dates';
import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';
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
  data: IDetailsTableRowData;
  isAdd: boolean = false;
  isSelected: boolean = false;
}
interface IDetailsTableProps {
  data: IDetailsTableRowData[];
}
const DetailsTable: React.FC<IDetailsTableProps> = (props) => {
  const [rowData, setRowData] = useState<Row[]>([]);
  useEffect(() => {
    setRowData(
      props.data.slice().map((x, i) => {
        return {
          index: i,
          data: x,
          isAdd: false,
          isSelected: false,
        };
      })
    );
  }, [props.data]);

  function sortData(sortBy: string, sortDir: number) {
    const data = [...rowData];
    console.log(sortDir);
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

  return (
    <div className={container}>
      <div className={tableContainer}>
        <GoATable onSort={sortData}>
          <thead>
            <tr>
              <th className={`${stickyColumn} ${start} ${onTop}`}>
                <div className={checkboxWrapper}>
                  <GoACheckbox
                    name={''}
                    checked={false}
                    disabled={true}
                  ></GoACheckbox>
                </div>
              </th>
              <th>
                <GoATableSortHeader name={'date'}>Date</GoATableSortHeader>
              </th>
              <th>Reg No.</th>
              <th>Report No.</th>
              <th>AO02 No.</th>
              <th>Rate Type</th>
              <th>
                <GoATableSortHeader name={'numberOfUnits'}>
                  No. of Units
                </GoATableSortHeader>
              </th>
              <th>Rate Unit</th>
              <th>
                <GoATableSortHeader name={'ratePerUnit'}>
                  Rate / unit
                </GoATableSortHeader>
              </th>
              <th>
                <GoATableSortHeader name={'cost'}>Cost</GoATableSortHeader>
              </th>
              <th>GL Account No.</th>
              <th>Profit Centre</th>
              <th>Cost Centre</th>
              <th>Fire No.</th>
              <th>Internal Order</th>
              <th>Fund</th>
              <th className={`${stickyColumn} ${end} ${onTop}`}></th>
            </tr>
          </thead>
          <tbody>
            {rowData.map((x, index) => (
              <tr key={index}>
                <td className={`${stickyColumn} ${start}`}>
                  <div className={checkboxWrapper}>
                    <GoACheckbox
                      name={`cb${index}`}
                      checked={false}
                      disabled={true}
                    ></GoACheckbox>
                  </div>
                </td>
                <td>{yearMonthDay(x.data.date)}</td>
                <td>{x.data.registrationNumber}</td>
                <td>{x.data.reportNumber}</td>
                <td>{x.data.aO02Number}</td>
                <td>{x.data.rateType}</td>
                <td>{x.data.numberOfUnits}</td>
                <td>{x.data.rateUnit}</td>
                <td>{convertToCurrency(x.data.ratePerUnit)}</td>
                <td>{convertToCurrency(x.data.cost)}</td>
                <td>{x.data.glAccountNumber}</td>
                <td>{x.data.profitCentre}</td>
                <td>{x.data.costCentre}</td>
                <td>{x.data.fireNumber}</td>
                <td>{x.data.internalOrder}</td>
                <td>{x.data.fund}</td>
                <td className={`${stickyColumn} ${end}`}>
                  <div className={buttonWrapper}>
                    <GoAButton size='compact' type='secondary' disabled={true}>
                      Remove
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

export default DetailsTable;
