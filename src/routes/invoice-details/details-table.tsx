import { GoAButton, GoACheckbox, GoATable } from '@abgov/react-components';
import styles from './details-table.module.scss';
import { yearMonthDay } from '@/common/dates';
import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';
import { useEffect, useState } from 'react';

let { container, checkboxColumn, checkboxWrapper, row } = styles;
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
  const tableHeaders = [
    'Date', //<GoATableSortHeader name={searchResultColumns[2].value}>
    'Reg No.',
    'Report No.',
    'AO02 No.',
    'Rate Type',
    'No. of units', //<GoATableSortHeader name={searchResultColumns[2].value}>
    'Rate Unit',
    'Rate / unit', //<GoATableSortHeader name={searchResultColumns[2].value}>
    'Cost', //<GoATableSortHeader name={searchResultColumns[2].value}>
    'GL Account No.',
    'Profit Centre',
    'Cost Centre',
    'Fire No.',
    'Internal Order',
    'Fund',
  ].map((x, index) => {
    return (
      <th key={index}>
        <span>{x}</span>
      </th>
    );
  });

  return (
    <div className={container}>
      <GoATable>
        <thead>
          <tr>
            <th className={checkboxColumn}>
              <GoACheckbox name={''} checked={false}></GoACheckbox>
            </th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((x, index) => (
            <tr key={index}>
              <td className={checkboxColumn}>
                <GoACheckbox name={`cb${index}`} checked={false}></GoACheckbox>
              </td>
            </tr>
          ))}
        </tbody>
      </GoATable>

      <GoATable>
        <thead>
          <tr>{tableHeaders}</tr>
        </thead>
        <tbody>
          {rowData.map((x, index) => (
            <tr className={row} key={index}>
              <td>{yearMonthDay(x.data.date)}</td>
              <td>{x.data.registrationNumber}</td>
              <td>{x.data.reportNumber}</td>
              <td>{x.data.aO02Number}</td>
              <td>{x.data.rateType}</td>
              <td>{x.data.numberOfUnits}</td>
              <td>{x.data.rateUnit}</td>
              <td>{x.data.ratePerUnit}</td>
              <td>{x.data.cost}</td>
              <td>{x.data.glAccountNumber}</td>
              <td>{x.data.profitCentre}</td>
              <td>{x.data.costCentre}</td>
              <td>{x.data.fireNumber}</td>
              <td>{x.data.internalOrder}</td>
              <td>{x.data.fund}</td>
            </tr>
          ))}
        </tbody>
      </GoATable>

      <GoATable>
        <thead>
          <tr>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((x, index) => (
            <tr key={index}>
              <td>
                <GoAButton size='compact' type='secondary'>
                  Add
                </GoAButton>
              </td>
            </tr>
          ))}
        </tbody>
      </GoATable>
    </div>
  );
};

export default DetailsTable;
