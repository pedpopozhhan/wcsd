import { GoACheckbox, GoATable } from '@abgov/react-components';
import styles from './details-table.module.scss';
import { yearMonthDay } from '@/common/dates';
import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';
import { useEffect, useState } from 'react';

let { container } = styles;

interface IDetailsTableProps {
  data: IDetailsTableRowData[];
}
const DetailsTable: React.FC<IDetailsTableProps> = (props) => {
  //   const [rowData, setRowData] = useState<IDetailsTableRowData[]>([]);
  //   useEffect(() => {
  //     setRowData(props.data.slice());
  //   }, [props.data]);
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
      <th key={index} style={index === 0 ? { position: 'sticky' } : {}}>
        <span>{x}</span>
      </th>
    );
  });

  return (
    <div className={container}>
      <GoATable>
        <thead>
          <tr>{tableHeaders}</tr>
        </thead>
        <tbody>
          {props.data.map((x, index) => (
            <tr key={index}>
              <td style={{ position: 'sticky' }}>{yearMonthDay(x.date)}</td>
              <td>{x.registrationNumber}</td>
              <td>{x.reportNumber}</td>
              <td>{x.aO02Number}</td>
              <td>{x.rateType}</td>
              <td>{x.numberOfUnits}</td>
              <td>{x.rateUnit}</td>
              <td>{x.ratePerUnit}</td>
              <td>{x.cost}</td>
              <td>{x.glAccountNumber}</td>
              <td>{x.profitCentre}</td>
              <td>{x.costCentre}</td>
              <td>{x.fireNumber}</td>
              <td>{x.internalOrder}</td>
              <td>{x.fund}</td>
            </tr>
          ))}
        </tbody>
      </GoATable>
    </div>
  );
};

export default DetailsTable;
