import { GoATable } from '@abgov/react-components';
import styles from './details-table.module.scss';

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
export default function DetailsTable() {
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

  return (
    <div className={container}>
      {/* <div className={test}></div> */}
      <GoATable>
        <thead>
          <tr>{tableHeaders}</tr>
        </thead>
        <tbody>
          <tr>
            <td>Item 1</td>
            <td className={test}>Item 2</td>
            <td className='goa-table-number-column'>54</td>
          </tr>
          <tr>
            <td>Item 4</td>
            <td>Item 5</td>
            <td className='goa-table-number-column'>5467</td>
          </tr>
        </tbody>
      </GoATable>
    </div>
  );
}
