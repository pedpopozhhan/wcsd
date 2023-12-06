import { GoATable } from '@abgov/react-components';
import styles from './details-table.module.scss';
import { yearMonthDay } from '@/common/dates';

let { container, test } = styles;

export class DetailsTableRowData {
  date: Date;
  registrationNumber: string;
  reportNumber: number;
  aO02Number: string;
  rateType: string;
  numberOfUnits: number;
  rateUnit: string;
  ratePerUnit: number; //with $0.00
  cost: number; //with $0.00
  glAccountNumber: number;
  profitCentre: string;
  costCentre: string;
  fireNumber: string;
  internalOrder: string;
  fund: number;
}

interface IDetailsTableProps {
  data: DetailsTableRowData[];
}
const DetailsTable: React.FC<IDetailsTableProps> = (props) => {
  const tableHeaders = [
    'Date',
    'Reg No.',
    'Report No.',
    'AO02 No.',
    'Rate Type',
    'No. of units',
    'Rate Unit',
    'Rate / unit',
    'Cost',
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

  const dataRows = () => {
    return props.data.map((x) => {
      return (
        <tr>
          <td>{yearMonthDay(x.date)}</td>
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
      );
    });
  };
  return (
    <div className={container}>
      <GoATable>
        <thead>
          <tr>{tableHeaders}</tr>
        </thead>
        <tbody>{dataRows()}</tbody>
      </GoATable>
    </div>
  );
};

export default DetailsTable;
